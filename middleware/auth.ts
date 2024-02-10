import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import nextConnect from "next-connect";
import { parse } from "cookie";

const authMiddleware = nextConnect<NextApiRequest, NextApiResponse>({
  onError(error, req, res, next) {
    res
      .status(501)
      .json({ error: `Sorry, something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
}).use((req, res, next) => {
  const token =
    req.headers.authorization?.split(" ")[1] ||
    parse(req.headers.cookie || "").token;

  if (!token || !process.env.SECRET) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next();
  }
});
export default authMiddleware;
