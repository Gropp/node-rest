import { Request, Response, NextFunction, Router } from "express";
import JWT, { SignOptions } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import basicAutentication from "../middlewares/basic-authentication.middleware";
import ForbiddenError from "../models/forbidden.error.model";
import jwtAuthentication from "../middlewares/jwt-authentication-middleware";

//chama um middleware para autenticar o usuario e devolve para a aplicao um token jwt para manter a seguranca da conexao

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

//TODO - A ORDEM DAS ROTAS É IMPORTANTE PARA O TRANSPILADOR, ROTAS MAIS ESPECIFICAS TEM QUE VIR ANTES DE ROTAS GENERICAS
//como vai ter uma chamada ao banco de dados para validar usuario e passwd é necessario que esse metodo seja assincrono - pois dentro dele havera um await
//TODO - O MIDDLEWARE DE AUTENTICACAO BASIC É CHAMADO VIA PARAMETRO DA FUNCAO PRINCIPAL DESTE MODULO
//ANTES DA FUNCAO ASSINCRONA ELE CHAMA O COMPONENTE AUTENTICADOR - NAO ESQUECER DE USAR O NEXT() NO FINAL DO MIDDLEWARE PARA QUE ELE SEJA EXECUTADO NESTA CHAMADA

//ROTA GENERICA - É O INICIO DA ARVORE
authorizationRoute.post('/token', basicAutentication, async(req: Request, res: Response, next: NextFunction) => {

    //tratamento de erro
    try {
        const user = req.user;
        if (!user) {
            throw new ForbiddenError('Usuário não informado');
        }
        //vamos criar um token para a nossa aplicacao para que a informacao entre o Microservico e os clientes tenham mais seguranca - confirmando os dois lados da aplicacao server-cliente
        //informacoes que vao alimentar o JWT - NO PAYLOAD QUE ESTAO AS INFORMACOES DO USUARIO!
        //o jwt tem uma opcao para validade de token, periodo em milisegundos
        //esse valor deve ser informado dentro das options
        const jwtPayload = {username: user.username};
        //const jwtOptions: SignOptions = {subject: user?.uuid};
        const jwtOptions: SignOptions = {subject: user?.uuid, expiresIn: '15m'};
        const secretKey = 'my_secret_key';

        //chama o JWT passando os parametros
        const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

        //token gerado ele volta para o chamador
        res.status(StatusCodes.OK).json({token:jwt})

        //VER COMO FAZER PARA FAZER REFRESH DE TOKEN

    } catch (error) {
        next(error);
    }
});

//toda a validacao do token é feita dentro do middleware, entao se chegar neste ponto é pq é valido
authorizationRoute.post('token/validate', jwtAuthentication, (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(StatusCodes.OK);
});

export default authorizationRoute;