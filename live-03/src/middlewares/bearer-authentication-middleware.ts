import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../models/forbidden.error.model";
import JWT from 'jsonwebtoken';
import userRepository from "../repositories/user.repository";

async function bearerAuthentication (req: Request, res: Response, next:NextFunction) {

    try {
        //guardamos o valor da authorizacao
        const authorizantionHeader = req.headers['authorization'];

        //testamos para testar o token ou se for vazio
        //se nao existir da erro
        if(!authorizantionHeader){
            throw new ForbiddenError('Credenciais não informadas - logar');
        }

        //caso tenha algum valor de autenticacao
        //lembre que o headers nos traz esse formato: "tipo de autenticacao" "token"
        //Basic FGA3r3s43TT4err
        //precisamos pegar a informacao depois do espaco para isso usamos o metodo split
        //desconstruindo a string
        const [authorizantionType, token] = authorizantionHeader.split(' ');

        //Testamos se o tipo de autenticacao é a esperada ou se o token esta vazio
        if (authorizantionType !== 'Bearer' || !token){
            throw new ForbiddenError('Tipo de autenticacao invalida');
        }

        //o Bearer trabalha com o token que nos geramos na autenticacao dos usuarios
        //na area de payload de nosso token era informada os dados do usario
        //agora precisamos ABRIR o token usando a mesma chave privada e entao resgatar o valor original guardado no payload - assim validamos o usuario depois de logado
        const tokenPayload = JWT.verify(token, 'my_secret_key');

        //o uuid do usuario esta dentro do subject do payload, entao precisamos descontruir o objeto

        if(typeof tokenPayload !== 'object' || !tokenPayload.sub) {
            throw new ForbiddenError('TOKEN inválido!');
        }
        const uuid = tokenPayload.sub;

        const user = await userRepository.findById(uuid);
        
        req.user = user;

        next();
    } catch (error) {
        next(error)
    }
}

export default bearerAuthentication;