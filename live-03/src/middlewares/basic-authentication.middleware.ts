import { Request, Response, NextFunction } from "express";
import ForbiddenError from "../models/forbidden.error.model";
import userRepository from "../repositories/user.repository";

//end-point que com base no metodo de autenticacao basic do http, obtem as credenciasi do usuario e as valida 

async function basicAutentication(req: Request, res: Response, next: NextFunction) {

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
        if (authorizantionType !== 'Basic' || !token){
            throw new ForbiddenError('Tipo de autenticacao invalida');
        }
        //o node tem um buffer para armazenar coisas importantes
        //vamos atribuir ao buffer o token que esta em base64 e vamos converter para utf8 para obtermos o usuario e a senha que foram enviados e colocar em uma constante
        const tokenContent = Buffer.from(token, 'base64').toString('utf-8');

        //agora que temos a string do token decodificada, e sabemos que o padrao é user:passwd
        //desconstruimos essa string usando o : como referencia
        const [username, password] = tokenContent.split(':');

        //testamos se as duas variaveis nao estao preenchidas
        if(!username || !password) {
            throw new ForbiddenError('Credenciais não preenchidas');
        }

        //existindo token e valores - chamamos o repositorio para ver se o usuario e a senha estao no BD e se estao corretos
        const user = await userRepository.findByUsernameAndPassword(username, password);

        //testa o retorno do repository
        if (!user) {
            throw new ForbiddenError('Usuario ou senha INVALIDOS!');
        }

        //para poder ter acesso ao retorno desse middleware, o objeto user, que é o produto final desse processo é colocado dentro da requisicao req, para isso criamo uma extensao deste metodo - usando o @types - alterando o typeRoots: do tsconfig.json e usando o diretorio @types na raiz
        req.user = user;
        //o next vazio vai para o proximo handler - neste caso é o componente que chama esse middleware
        //se tivesse um erro como parametro ele iria para o ErrorHandler configurado
        next();

    } catch (error) {

        next(error);
    }    
}

export default basicAutentication;