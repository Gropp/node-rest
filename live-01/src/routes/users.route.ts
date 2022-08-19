//TODAS AS ROTAS DOS USUARIOS PARA FAZER CRUD
//GET /USERS (LISTA) - GET /USERS/:UUID (UM ESPECIFICO) - POST /USERS (INCLUI) - PUT /USERS/:UUID (ALTERA) - DELETE /USERS/:UUID (DELETA) - TUDO QUE TEM :UUID É QUE JA EXISTE NA BASE E ESTA SENDO IDENTIFICADO, O UUID É O WHERE DO USUARIO
//USANDO O EXPRESS PARA FAZER AS ROTAS

import { NextFunction, Request, Response, Router } from "express";
//TUDO QUE ENTRA NA REQUISICAO VEM PELO REQUESTE - REQ
//TUDO QUE SAI DA REQUISICAO SAO PELO RESPONSE - RES

import { StatusCodes } from "http-status-codes";
//BIBLIOTECA COM AS CONSTANTES DOS CODIGOS HTTP

//criando configuracoes de rotas sem estar amarrado na instancia de aplicacao
//instancia a funcao
const usersRoute = Router();

//ROTA PARA GET /USERS - LISTAR TODOS
usersRoute.get('/users', (req: Request, res: Response, next: NextFunction) => {
    const users = [{ userName: 'Fernando'}];
    res.status(StatusCodes.OK).send(users);
});

//ROTA PARA GET /USERS/:UUID - LISTA CLIENTE ESPECIFICO
//CONSEGUIMOS TIPIFICAR O TIPO DE DADO DO UUID
usersRoute.get('/users/:uuid', (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    //aqui voce coloca o banco de dados e faz um select nos users usando o uuid como where
    res.status(StatusCodes.OK).send({uuid});
});

export default usersRoute;