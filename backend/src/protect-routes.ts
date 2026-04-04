import { expressjwt } from "express-jwt";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

export const checkUser = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
});

export const handleAuthorizationError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
        res.status(401).json({ error: "Authentication is required for this operation." });
    } else {
        next(err);
    }
};
