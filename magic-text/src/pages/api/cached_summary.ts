import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const dynamic = "forced-dynamic";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;

  if (method === "GET") {
    const v = query.v as string;

    const resp = await prisma.summary.findFirst({
      where: {
        video_id: v,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!resp) {
      res.status(500).send({ error: "failed to fetch data" });
    }

    res.status(200).json(resp);
  } else {
    res.status(500).send({ error: "method not allowed" });
  }
}
