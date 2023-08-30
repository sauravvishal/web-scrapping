import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "../config/config";
import { Urls } from "./entity/Url";
import { Product_urls } from "./entity/ProductUrls";
import { Products } from "./entity/Product";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DATABASE,
    synchronize: true,
    logging: false,
    entities: [Urls, Product_urls, Products],
    migrations: [],
    subscribers: [],
});
