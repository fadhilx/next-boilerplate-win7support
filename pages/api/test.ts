// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

export default nextConnect<NextApiRequest, NextApiResponse<any>>().get(
  (req, res) => {
    res.status(200).json({ name: "John Doe" });
  }
);
