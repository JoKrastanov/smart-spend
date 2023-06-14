import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import { bankAccountRouter } from "./routes/bankAccountRoutes";
import config from "../config";

const app = express();

// * CORS Policy
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * App Routes
app.use("/bank", bankAccountRouter);

app.listen(config.server.port, async () => {
  mongoose
    .connect(config.mongo.url, { retryWrites: true, w: "majority" })
    .then(() => {
      console.log("Connected to mongoDB.");
    })
    .catch((error) => {
      console.error("Unable to connect to mongoDB: ", error);
    });
  config.sql.connection.connect((error) => {
    if (error) {
      console.error("Unable to connect to sql: ", error);
      return;
    }
    console.log("Connected to sql.");
  });
  console.log(`Running on ENV = ${config.server.environment}`);
  console.log("Server is running at port:", config.server.port);
});
