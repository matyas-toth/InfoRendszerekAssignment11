import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected!");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });