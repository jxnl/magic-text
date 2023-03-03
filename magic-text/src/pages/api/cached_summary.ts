import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;

  if (method === "GET") {
    const v = query.v as string;
    console.log(`Checking cache for video ${v}...`);
    const resp = await prisma.summary.findFirst({
      where: {
        video_id: v,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!resp) {
      console.log(`No cache found for video ${v}...`);
      res.status(500).send({ error: "failed to fetch data" });
      return;
    }

    console.log(`Cache found for video ${v}...`);
    res.status(200).json(resp);
  } else {
    res.status(500).send({ error: "method not allowed" });
    return;
  }
}
