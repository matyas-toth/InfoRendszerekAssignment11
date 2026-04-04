import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { getRoutes } from "./routes";
import { handleAuthorizationError } from "./protect-routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", getRoutes(), handleAuthorizationError);

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected!");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });