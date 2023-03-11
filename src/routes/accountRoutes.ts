import { Router } from "express";

export const accountRouter = Router();

accountRouter.get("/", (req, res) => {
  res.status(200).json({message : "yes"});
});
