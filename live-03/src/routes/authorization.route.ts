import { Request, Response, NextFunction, Router } from "express";
import ForbiddenError from "../models/forbidden.error.model";
import userRepository from "../repositories/user.repository";
import JWT from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

//componente para autenticar o usuario chamado pelo enndereco url /token
//ele chama o repositorio de usuarios para autenticar a informacao
//neste componente iremos usar o jsonwebtoken para validar o conteudo do token trafegado
//assim garantimos que a conexao e a informacao trafega estao indo para um usuario autenticado

//"iss" - dominio da aplicacao geradora do token
//"sub" - o assunto do token - quarda o id do usuario
//"aud" - define quem pode usar o token
//"exp" - data para expirar o token
//"iss" - define uma data futura para uso do token - antes nao funciona
//"iat" - data de criacao do token
//"jti" - o id do token

//instancio uma nova instancia de rotas
const authorizationRoute = Router();

//como vai ter uma chamada ao banco de dados para validar usuario e passwd é necessario que esse metodo seja assincrono - pois dentro dele havera um await
authorizationRoute.post('/token', async(req: Request, res: Response, next: NextFunction) => {

    //tratamento de erro
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

        //vamos criar um token para a nossa aplicacao para que a informacao entre o Microservico e os clientes tenham mais seguranca - confirmando os dois lados da aplicacao server-cliente
        //informacoes que vao alimentar o JWT
        const jwtPayload = {username: user.username};
        const jwtOptions = {subject: user?.uuid};
        const secretKey = 'my_secret_key';

        const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

        //token gerado ele volta para o chamador
        res.status(StatusCodes.OK).json({token:jwt})

    } catch (error) {
        next(error);
    }
});

export default authorizationRoute;