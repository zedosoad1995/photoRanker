import { Request, Response } from "express";

export const upload = async (req: Request, res: Response) => {
  console.log(req.file);
  console.log(req.body);

  res.status(200).json();
};
