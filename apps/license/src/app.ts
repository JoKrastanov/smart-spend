import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import config from '../config';

import { licenseRouter } from "./routes/licenseRoutes";
import { companyRouter } from "./routes/companyRoutes";

const app: Express = express();

// * CORS Policy
app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * App Routes
app.use('/license', licenseRouter);
app.use('/company', companyRouter);

app.listen(config.server.port, async () => {
  mongoose
  .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
      console.log(`Running on ENV = ${config.server.environment}`);
      console.log('Connected to mongoDB.');
    })
    .catch((error) => {
      console.log('Unable to connect.');
      console.log(error);
    });
  console.log("Server is running at port:", config.server.port);
});
