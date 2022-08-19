//Middleware - componente de meio de campo responsavel por interceptar as requisicoes
//esse trata erros
//sao functions
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import DatabaseError from "../models/database.error.model";
import ForbiddenError from "../models/forbidden.error.model";


function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
    //testa se o erro veio da aplicacao/bd ou se foi outro erro
    //import o componente DatabaseError
    if (error instanceof DatabaseError) {
        //sendo erro da aplicacao ou do user (pois o id errado)
        res.sendStatus(StatusCodes.BAD_REQUEST);
    } else if (error instanceof ForbiddenError) {
        //sendo erro de autenticacao
        res.sendStatus(StatusCodes.FORBIDDEN);
    } else {
        //sendo um erro do meio (caiu o servidor)
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default errorHandler;