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
    constructor() {
        this.PORT = +process.env.PORT! || 3000;
        this.DB_TYPE = process.env.DB_TYPE! || "postgres";
        this.DB_HOST = process.env.DB_HOST! || "localhost";
        this.DB_PORT = +process.env.DB_PORT! || 5432;
        this.DB_USERNAME = process.env.DB_USERNAME! || "postgres";
        this.DB_PASSWORD = process.env.DB_PASSWORD! || "123";
        this.DATABASE = process.env.DATABASE! || "test";
    }
}

export const config = new Config();