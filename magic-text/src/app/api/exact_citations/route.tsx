import {NextRequest, NextResponse} from "next/server";

if (!process.env.CITATIONS_URL) {
  throw new Error("Require CITATIONS_URL")
}
if (!process.env.CITATIONS_TOKEN) {
  throw new Error("Require CITATIONS_TOKEN")
}

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
      Authorization: `Bearer ${process.env.CITATIONS_TOKEN}`
    }
  })
  if (!response.body) {
    console.error("No body found!")
    return NextResponse.json({}, {status: 500})
  }

  return new Response(response.body)
}