// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { LoginFormDataType, LoginSuccessResponse } from "@/models/auth";
import { serialize } from "cookie";

export default nextConnect<
  NextApiRequest,
  NextApiResponse<LoginSuccessResponse | { message: string; error?: any }>
>().post(async (req, res) => {
  try {
    const cookie = serialize("token", "", {
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ message: "Cookie set" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});
