import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { AppDataSource } from "../data-source";
import { Location } from "../entity/Location";

export class LocationController extends BaseController<Location> {
    repository = AppDataSource.getRepository(Location);

    toggleActive = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string);
            const entity = await this.repository.findOneBy({ id } as any);
            if (!entity) {
                return res.status(404).json({ error: "Nincs ilyen helszín." });
            }
            entity.active = !entity.active;
            const saved = await this.repository.save(entity);
            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    };
}
