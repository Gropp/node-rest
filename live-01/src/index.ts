//o express é um gerenciador de rotas http
import express, { Request, Response, NextFunction} from "express";
import usersRoute from "./routes/users.route";

//instancia a biblioteca
const app = express();

//manda esse componente utilizar a configuracao feita no usersRoute - que sao as rotas dos clientes
app.use(usersRoute);

//definindo a PORTA do servidor
const PORT = 3000

//quando chegar uma requisicao (GET) em /status o aplicativo roda o codigo da funcao arrow
//o express sempre trabalha com request, results e next
//ele vai retornar um JSON (foo)
//com o TS podemos tipar os argumentos
//deixamos uma rota default para TESTAR o servidor
app.get('/status', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({foo: 'Servidor no AR!'});
});

//precisamos que o servidor fique monitarando as requisicoes em uma porta
app.listen(PORT, () => {
    console.log(`A aplicação esta sendo executada na porta: ${PORT}`);
});