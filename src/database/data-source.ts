import "reflect-metadata";
import { DataSource } from "typeorm";
import { Urls } from "./entity/Url";
import { config } from "../config/config";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DATABASE,
    synchronize: true,
    logging: false,
    entities: [Urls],
    migrations: [],
    subscribers: [],
});
