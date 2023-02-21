import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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
      res.status(404).json({ message: "Not Found" });
    }

    res.status(200).json(resp);
  }
}
