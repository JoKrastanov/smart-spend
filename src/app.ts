import dotenv from "dotenv";
import express, { Express } from "express";
import { accountRouter } from "./routes/accountRoutes";
import cors from "cors";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;
const API_BASE = "/api/"

// routes
app.use(API_BASE + 'account', accountRouter);

app.use(
  cors({
    origin: "*",
  })
);

app.listen(PORT, () => {
  console.log("Server is running at port:", PORT);
});
