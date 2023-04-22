import dotenv from 'dotenv';

dotenv.config();

// DECLARE ALL VARIABLES
const MONGO_DB_USER = process.env.MONGO_DB_USER || '';
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || '';
const MONGO_URL = `mongodb+srv://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@smartspend.xuliyfb.mongodb.net/?retryWrites=true&w=majority`;
const SERVER_PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

export interface Config {
    mongo: {
        url: string
    },
    server: {
        environment: string
        port: Number
    }
}

//CREATE CONFIG OBJECT
const config: Config = {
    mongo: {
        url: MONGO_URL,
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