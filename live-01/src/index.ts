//o express é um gerenciador de rotas http
import express, { Request, Response, NextFunction} from "express";
import statusRoute from "./routes/status.route";
import usersRoute from "./routes/users.route";

//instancia a biblioteca
const app = express();

//CONFIGURACOES DA APLICACAO
//configura um middleware que é responsavel por interpretar os objetos que recebem json
app.use(express.json());
//configura a aplicao para entender diferentes tipos de url
app.use(express.urlencoded({extended: true}));

//CONFIGURACAO DAS ROTAS - MANDA A APLICACAO USAR AS ROTAS CRIADAS
//manda esse componente utilizar a configuracao feita no usersRoute - que sao as rotas dos clientes
app.use(usersRoute);
app.use(statusRoute);

//definindo a PORTA do servidor
const PORT = 3000

//precisamos que o servidor fique monitarando as requisicoes em uma porta
app.listen(PORT, () => {
    console.log(`A aplicação esta sendo executada na porta: ${PORT}`);
});