// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import authMiddleware from "@/middleware/auth";
import { PrismaClient, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

const prisma = new PrismaClient();

export default nextConnect<
  NextApiRequest & { user?: User },
  NextApiResponse<any>
>()
  .use(authMiddleware)
  .get(async (req, res) => {
    const { username } = req.query;
    if (typeof username === "string") {
      const { ...user } =
        (await prisma.user.findUnique({
          where: { username },
          select: {
            id: true,
            username: true,
          },
        })) || {};
      if (!user) res.status(401).json({ message: "Unauthorized" });
      return res.status(200).json(user);
    }
    res.status(401).json({ message: "Unauthorized" });
  });
