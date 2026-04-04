import express from "express";
import { UserController } from "./controller/user.controller";
import { checkUser } from "./protect-routes";

export function getRoutes() {
    const router = express.Router();
    const userController = new UserController();

    router.get("/users", userController.getAll);
    router.get("/users/:id", userController.getOne);
    router.post("/users", userController.create);
    router.post("/users/login", userController.login);
    router.put("/users", checkUser, userController.update);
    router.delete("/users/:id", checkUser, userController.delete);

    return router;
}
