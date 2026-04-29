import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BaseController } from "./base.controller";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

export class UserController extends BaseController<User> {
    repository = AppDataSource.getRepository(User);

    create = async (req: Request, res: Response) => {
        try {
            const { email, password, firstName, lastName } = req.body;

            if (!email || !password || !firstName || !lastName) {
                return this.handleError(res, null, 400, "Az összes mező kitöltése kötelező.");
            }

            const existing = await this.repository.findOneBy({ email });
            if (existing) {
                return this.handleError(res, null, 409, "Ez az e-mail már használatban van");
            }

            const entity = this.repository.create({ email, firstName, lastName } as User);
            entity.password = await bcrypt.hash(password, 12);

            const saved = await this.repository.save(entity);
            delete (saved as any).password;

            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return this.handleError(res, null, 400, "Email és jelszó megadása kötelező.");
            }

            const user = await this.repository.findOne({
                where: { email },
                select: ["id", "email", "firstName", "lastName", "password"],
            });

            if (!user) {
                return this.handleError(res, null, 401, "Helytelen email vagy jelszó.");
            }

            const passwordMatches = await bcrypt.compare(password, user.password);
            if (!passwordMatches) {
                return this.handleError(res, null, 401, "Helytelen email vagy jelszó.");
            }

            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "2w" });

            res.json({
                accessToken: token,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });
        } catch (err) {
            this.handleError(res, err);
        }
    };
}
