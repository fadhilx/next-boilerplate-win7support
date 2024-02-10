// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import authMiddleware from "@/middleware/auth";
import { PrismaClient, User } from "@prisma/client";
import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import nextConnect from "next-connect";

const prisma = new PrismaClient();

export default nextConnect<
  NextApiRequest & { user?: User },
  NextApiResponse<any>
>()
  .use(authMiddleware)
  .post(async (req, res) => {
    if (req.user && process.env.SECRET) {
      const { user } = req;
      try {
        const token = jwt.sign(
          { username: user.username },
          process.env.SECRET,
          {
            expiresIn: "10m",
          }
        );
        return res.status(200).json({ token });
      } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
      }
    }
    res.status(401).json({ message: "Unauthorized" });
  });
