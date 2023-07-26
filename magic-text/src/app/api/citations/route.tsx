import {NextRequest, NextResponse} from "next/server";

if (!process.env.CITATIONS_URL) {
  throw new Error("Require CITATIONS_URL")
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Require OPENAI_API_KEY")
}

export const runtime = 'edge'

export type ICitationLocation = [number, number]

export type ICitationData = {
  body: string,
  spans: ICitationLocation[],
  citation: string[],
}


export async function POST(request: NextRequest) {
  const {context, query} = await request.json()

  const response = await fetch(process.env.CITATIONS_URL!, {
    method: "POST",
    body: JSON.stringify({
      context, query
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    }
  })
  if (!response.body) {
    console.error("No body found!")
    return NextResponse.json({}, {status: 500})
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder();

  return new Response(new ReadableStream({
    start: (controller) => {
      return pump();

      async function pump(): Promise<void> {
        const {done, value} = await reader.read();
        if (done) {
          controller.close();
          return;
        }
        const data = decoder.decode(value);
        const prefix = data.substring(0, 6)
        if (prefix !== "data: ") {
          throw new Error("Incorrect prefix in backend response")
        }
        const postfix = data.substring(6)
        if (postfix !== "[DONE]") {
          controller.enqueue(postfix);
        }

        return pump();
      }
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    }
  })
}