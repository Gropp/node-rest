//TODAS AS ROTAS DOS USUARIOS PARA FAZER CRUD
//GET /USERS (LISTA) - GET /USERS/:UUID (UM ESPECIFICO) - POST /USERS (INCLUI) - PUT /USERS/:UUID (ALTERA) - DELETE /USERS/:UUID (DELETA) - TUDO QUE TEM :UUID É QUE JA EXISTE NA BASE E ESTA SENDO IDENTIFICADO, O UUID É O WHERE DO USUARIO
//USANDO O EXPRESS PARA FAZER AS ROTAS

import { NextFunction, Request, Response, Router } from "express";
//TUDO QUE ENTRA NA REQUISICAO VEM PELO REQUESTE - REQ
//TUDO QUE SAI DA REQUISICAO SAO PELO RESPONSE - RES

import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository";
//BIBLIOTECA COM AS CONSTANTES DOS CODIGOS HTTP

//criando configuracoes de rotas sem estar amarrado na instancia de aplicacao
//instancia a funcao
const usersRoute = Router();

//ROTA PARA GET /USERS - LISTAR TODOS
//ACESSO AO BD É ASSINCRONO
usersRoute.get('/users', async (req: Request, res: Response, next: NextFunction) => {

    //VAMOS LISTAR OS HEADERS DO HTTP PARA VER A AUTENTICACAO
    console.log(req.headers['authorization']);

    //COM BD POSTGRESQL
    const users = await userRepository.findAllUsers();
    
    //TESTE SEM BD
    //const users = [{ userName: 'Fernando'}];
    res.status(StatusCodes.OK).send(users);
});

//ROTA PARA GET /USERS/:UUID - LISTA CLIENTE ESPECIFICO
//CONSEGUIMOS TIPIFICAR O TIPO DE DADO DO UUID
usersRoute.get('/users/:uuid', async(req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    // na aplicacao que recebe o throw se trata o erro
    try {
        const uuid = req.params.uuid;
        //aqui voce coloca o banco de dados e faz um select nos users usando o uuid como where
        const user = await userRepository.findById(uuid);
        //com o banco vc retorna o user
        res.status(StatusCodes.OK).send(user);
        //res.status(StatusCodes.OK).send({uuid});
    } catch (error) {
        //a next function como definido do index é o middleware error-handler
        next(error);
    }
});

//ROTA PARA POST /USERS - INCLUI UM NOVO CLIENTE
usersRoute.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    //o body é um objeto - para receber o json é preciso configurar no index.ts
    const newUser = req.body;
    //aqui voce coloca o banco de dados e faz um select nos users usando o uuid como where
    const uuid = await userRepository.create(newUser);
    res.status(StatusCodes.CREATED).send(newUser);
});

//ROTA PARA PUT /USERS/:UUID - ALTERA UM CLIENTE ESPECIFICO
//CONSEGUIMOS TIPIFICAR O TIPO DE DADO DO UUID
usersRoute.put('/users/:uuid', async (req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    //captura o id
    const uuid = req.params.uuid;
    //captura o nome do usuario deste ID
    const modifiedUser = req.body;
    //no corpo seleciona o usuario ID
    modifiedUser.uuid = uuid;
    //aqui voce coloca o banco de dados e faz um select nos users usando o uuid como where
    await userRepository.update(modifiedUser);
    res.status(StatusCodes.OK).send(modifiedUser);
});

//ROTA PARA DELETE /USERS/:UUID - DELETA UM CLIENTE ESPECIFICO
//CONSEGUIMOS TIPIFICAR O TIPO DE DADO DO UUID
usersRoute.delete('/users/:uuid', async(req: Request<{ uuid: string }>, res: Response, next: NextFunction) => {
    const uuid = req.params.uuid;
    await userRepository.remove(uuid);
    //como é um delete, nao tem resposta, é sucesso ou erro
    //como nao tem corpo de resposta, no delete a propriedade é sendStatus, e nao status como nos outros
    res.sendStatus(StatusCodes.OK);
});

export default usersRoute;