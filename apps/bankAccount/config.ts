import dotenv from "dotenv";
import mysql, { Connection } from "mysql2";

dotenv.config();

// DECLARE ALL VARIABLES
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 6000;

const MONGO_DB_USER = process.env.MONGO_DB_USER || "";
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${MONGO_DB_USER}.xuliyfb.mongodb.net/?retryWrites=true&w=majority`;

const SQL_DB_USER = process.env.SQL_INSTANCE_ID;
const SQL_DB_PASSWORD = process.env.SQL_INSTANCE_PASSWORD;
const SQL_DB_NAME = "smart-spend";
const SQL_CON = process.env.SQL_CONNECTION;
const SQL_URL = `mysql://${SQL_DB_USER}:${SQL_DB_PASSWORD}@${SQL_CON}/${SQL_DB_NAME}?ssl={"rejectUnauthorized":true}`;
const SQL_CONNECION: Connection = mysql.createConnection(SQL_URL);

const RabbitMQ_BASE_URL = process.env.RabbitMQ_BASE_URL || "";
const RabbitMQ_USER = process.env.RabbitMQ_USER || "";
const RabbitMQ_PASSWORD = process.env.RabbitMQ_PASSWORD || "";
const RabbitMQ_URL = `amqps://${RabbitMQ_USER}:${RabbitMQ_PASSWORD}@${RabbitMQ_BASE_URL}/${RabbitMQ_USER}`;

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
  rabbitMq: {
    url: string;
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
  rabbitMq: {
    url: RabbitMQ_URL,
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
