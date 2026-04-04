import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Location } from "./entity/Location";
import { Donor } from "./entity/Donor";
import { Donation } from "./entity/Donation";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "mydb",
    synchronize: true,
    logging: false,
    entities: [User, Location, Donor, Donation],
});