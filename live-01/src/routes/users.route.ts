//TODAS AS ROTAS DOS USUARIOS PARA FAZER CRUD
//GET /USERS (LISTA) - GET /USERS/:UUID (UM ESPECIFICO) - POST /USERS (INCLUI) - PUT /USERS/:UUID (ALTERA) - DELETE /USERS/:UUID (DELETA) - TUDO QUE TEM :UUID É QUE JA EXISTE NA BASE E ESTA SENDO IDENTIFICADO, O UUID É O WHERE DO USUARIO
//USANDO O EXPRESS PARA FAZER AS ROTAS

import { NextFunction, Request, Response, Router } from "express";

//criando configuracoes de rotas sem estar amarrado na instancia de aplicacao
//instancia a funcao
const usersRoute = Router();

usersRoute.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const users = [{ userName: 'Fernando'}];
    res.status(200).send({users});
});

export default usersRoute;