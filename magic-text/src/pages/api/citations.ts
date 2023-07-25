import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";

export const config = {
  runtime: "edge",
};

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export interface Message {
  role: "user";
  content: string;
}

interface CitationRequest {
  context: string;
  query: string;
}

export async function CitationStream(payload: CitationRequest) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;
  const url = process.env.CITATIONS_URL;

  if (!url) {
    throw new Error("Require CITATIONS_URL");
  }

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Citation API error: ${res.statusText}`);
  }

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const queue = encoder.encode(data);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
}

const handler = async (req: Request): Promise<Response> => {
  const { context, query } = (await req.json()) as {
    context?: string;
    query?: string;
  };

  if (!context) {
    return new Response("No prompt in the request", { status: 400 });
  }

  if (!query) {
    return new Response("No question in the request", { status: 400 });
  }

  const payload: CitationRequest = {
    context: context,
    query: query,
  };

  const stream = await CitationStream(payload);
  return new Response(stream);
};

export default handler;
