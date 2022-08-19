//COMPONENTE PRINCIPAL - CHAMA TODOS OS OUTROS
//o express é um gerenciador de rotas http
import express from "express";
import errorHandler from "./middlewares/error-handler.middleware";
import authorizationRoute from "./routes/authorization.route";
import statusRoute from "./routes/status.route";
import usersRoute from "./routes/users.route";

//instancia a biblioteca
const app = express();


//TODO - CONFIGURACOES DA APLICACAO

//configura um middleware NATIVO que é responsavel por interpretar os objetos que recebem json
app.use(express.json());
//configura a aplicao para entender diferentes tipos de url
app.use(express.urlencoded({extended: true}));


//TODO - MIDDLEWARES DE USO GERAL

//O middleware de autenticacao é chamado na rota de autorizacao, pois somente lá ele pode ser usado

//CONFIGURANDO A MANIPULACAO DE ERROS
//agora a aplicacao conhece esse componente
//a aplicacao é levada a ele pelo next - parametros da funcao
app.use(errorHandler);


//TODO - CONFIGURACAO DAS ROTAS - MANDA A APLICACAO USAR AS ROTAS CRIADAS

//manda esse componente utilizar a configuracao feita no usersRoute - que sao as rotas dos clientes
app.use(usersRoute);
app.use(statusRoute);
app.use(authorizationRoute);


//TODO - CONEXAO COM A PORTA PARA SUBIR O SERVICO

//definindo a PORTA do servidor
const PORT = 3000

//precisamos que o servidor fique monitarando as requisicoes em uma porta
app.listen(PORT, () => {
    console.log(`A aplicação esta sendo executada na porta: ${PORT}`);
});