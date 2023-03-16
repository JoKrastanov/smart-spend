import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";

import { accountRouter } from "./routes/accountRoutes";
import { authRouter } from "./routes/authenticationRoutes";

dotenv.config();
const app: Express = express();
const PORT: String | number = process.env.PORT || 3000;

// * CORS Policy
app.use(
  cors({
    origin: "*",
  })
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * App Routes
app.use(process.env.API_BASE + "account", accountRouter);
app.use(process.env.API_BASE + "auth", authRouter)

app.listen(PORT, async () => {
  console.log("Server is running at port:", PORT);
});
