import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import express, { Express } from "express";

import { licenseRouter } from "./routes/licenseRoutes";

dotenv.config();
const app: Express = express();
const PORT: String | number = process.env.PORT || 5000;

// * CORS Policy
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * App Routes
app.use('/api/license', licenseRouter);

app.listen(PORT, async () => {
  console.log("Server is running at port:", PORT);
});
