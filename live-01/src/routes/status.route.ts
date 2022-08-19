import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

const statusRoute = Router();

//quando chegar uma requisicao (GET) em /status o aplicativo roda o codigo da funcao arrow
//o express sempre trabalha com request, results e next
//ele vai retornar um JSON (foo)
//com o TS podemos tipar os argumentos
//deixamos uma rota default para TESTAR o servidor
statusRoute.get('/status', (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.OK).send({foo: 'Servidor no AR!'});
    //abaixo uma opcao que nao retorna nada para o HTML
    //res.sendStatus(StatusCodes.OK);
});

export default statusRoute;