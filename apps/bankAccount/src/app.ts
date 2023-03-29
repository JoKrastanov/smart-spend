import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";
import { bankAccountRouter } from "./routes/bankAccountRoutes"

dotenv.config();
const app: Express = express();
const PORT: String | number = process.env.PORT || 6000;

// * CORS Policy
app.use(
  cors({
    origin: "*",
  })
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * App Routes
app.use('/api/bank', bankAccountRouter);

app.listen(PORT, async () => {
  console.log("Server is running at port:", PORT);
});