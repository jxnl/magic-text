export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { search } = (await req.json()) as {
    search?: string;
  };

  if (!search) {
    return new Response("No prompt in the request", { status: 400 });
  }

  const result = {
    result: "request was made to `/tool/wiki` with search: " + search,
  };

  return new Response(JSON.stringify(result));
};

export default handler;
