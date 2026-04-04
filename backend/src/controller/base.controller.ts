import { Repository } from "typeorm";
import { Request, Response } from "express";

export abstract class BaseController<T extends { id: number }> {
    abstract repository: Repository<T>;

    getAll = async (req: Request, res: Response) => {
        try {
            const entities = await this.repository.find();
            res.json(entities);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    getOne = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string);
            const entity = await this.repository.findOneBy({ id } as any);
            if (!entity) {
                return res.status(404).json({ error: "Entity not found." });
            }
            res.json(entity);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const entity = this.repository.create(req.body as T);
            delete (entity as any).id;
            const saved = await this.repository.save(entity);
            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const entity = this.repository.create(req.body as T);
            const saved = await this.repository.save(entity);
            res.json(saved);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id as string);
            const result = await this.repository.delete(id);
            res.json(result);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    handleError(res: Response, err: any, status = 500, message = "Server error.") {
        if (err) {
            console.error(err);
        }
        res.status(status).json({ error: message });
    }
}
