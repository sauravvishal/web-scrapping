import dotenv from "dotenv";
dotenv.config();

class Config {
    PORT: number;
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DATABASE: string;
    VESTAIRE_ID: number;
    LAMPOO_ID: number;
    REAL_ID: number;
    THREDUP_ID: number;
    LUXURY_ID: number;
    constructor() {
        this.PORT = +process.env.PORT! || 3000;
        this.DB_TYPE = process.env.DB_TYPE! || "postgres";
        this.DB_HOST = process.env.DB_HOST! || "localhost";
        this.DB_PORT = +process.env.DB_PORT! || 5432;
        this.DB_USERNAME = process.env.DB_USERNAME! || "postgres";
        this.DB_PASSWORD = process.env.DB_PASSWORD! || "123";
        this.DATABASE = process.env.DATABASE! || "test";
        this.VESTAIRE_ID = +process.env.VESTAIRE_ID! || 1;
        this.LAMPOO_ID = +process.env.LAMPOO_ID! || 2;
        this.REAL_ID = +process.env.REAL_ID! || 3;
        this.THREDUP_ID = +process.env.THREDUP_ID! || 4;
        this.LUXURY_ID = +process.env.LUXURY_ID! || 5;
    }
}

export const config = new Config();