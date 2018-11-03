import { injectable, inject } from "inversify";
import { Router, Request, Response } from "express";
import Types from "../types";
import { LexicalService } from "../lexical-service/lexical-service";
@injectable()
export class RouterLexical {

    public constructor(@inject(Types.LexicalService) private lexicalService: LexicalService) {}

    public get routes(): Router {
        const router: Router = Router();

        router.get(
                "/word/:constraint",
                (req: Request, res: Response ) => this.lexicalService.getRandomWord(req.params.constraint, req.query.rarety, res));
        router.get(
                "/words/:constraint",
                (req: Request, res: Response ) => this.lexicalService.getAllWords(req.params.constraint, req.query.rarety, res));
        router.get(
                "/definition/:word",
                (req: Request, res: Response ) => this.lexicalService.getWordDefinitions(req.params.word, req.query.difficulty, res));

        return router;
    }
}
