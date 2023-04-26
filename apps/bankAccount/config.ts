import dotenv from "dotenv";
import mysql, { Connection, Pool } from "mysql";

dotenv.config();

// DECLARE ALL VARIABLES
const MONGO_DB_USER = process.env.MONGO_DB_USER || "";
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@smartspend.xuliyfb.mongodb.net/?retryWrites=true&w=majority`;

const SQL_DB_USER = process.env.SQL_INSTANCE_ID;
const SQL_DB_PASSWORD = process.env.SQL_INSTANCE_PASSWORD;
const SQL_DB_IP = process.env.SQL_IP_ADDRESS;
const SQL_DB_NAME = "smart-spend";
const SQL_CON_NAME = process.env.SQL_CONNECTION_NAME;

const SQL_CONNECION: Connection = mysql.createConnection({
  host: SQL_DB_IP,
  user: SQL_DB_USER,
  password: SQL_DB_PASSWORD,
  database: SQL_DB_NAME,
  socketPath: `/cloudsql/${SQL_CON_NAME}`,
});

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 6000;

export interface Config {
  mongo: {
    url: string;
  };
  sql: {
    connection: Connection;
  };
  server: {
    environment: string;
    port: Number;
  };
}

//CREATE CONFIG OBJECT
const config: Config = {
  mongo: {
    url: MONGO_URL,
  },
  sql: {
    connection: SQL_CONNECION,
  },
  server: {
    environment: NODE_ENV,
    port: SERVER_PORT,
  },
};

// //CHECK FOR ENVIRONMENT
// if (NODE_ENV === 'production') {
//     config.mongo.url = MONGO_URL;
//     config.server.port = SERVER_PORT;
// } else if (NODE_ENV === 'local') {
//     config.mongo.url = MONGO_URL_LOCAL;
//     config.server.port = SERVER_PORT;
// }

//EXPORT
export default config;
