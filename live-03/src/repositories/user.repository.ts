import User from "../models/user.model";
import db from "../db.postgresql";
import DatabaseError from "../models/database.error.model";
import { brotliDecompress } from "zlib";

class userRepository {

    //SELECT ALL
    async findAllUsers(): Promise<User[]> {
        const query = `
            SELECT uuid, username
            FROM api_user
        `;

        //o result tem a propriedade rows no metodo, entao podemos chamar ela diretamente
        //ogject destructing
        const { rows } = await db.query<User>(query); 
        
        //MANEIRA MAIS LONGA
        // const result = await db.query<User>(query); 
        // const rows = result.rows;
        
        return rows || [];
    }

    //SELECT BY ID
    async findById(uuid: string): Promise<User> {
        //para tratar erros precisamos 
        try {
            // com $ passa o parametro de maneira oculta, sem expor
            const query = `
                SELECT uuid, username
                FROM api_user
                WHERE uuid = $1
            `;

            //como ser um filtro por id, o parametro é o uuid
            const values = [uuid];

            //como tem where, é preciso passar parametros para a query - o $1 no caso
            const { rows } = await db.query<User>(query, values);

            //descontruimos o array de resposta para pegar o usuario na posicao 0
            //ja que neste caso como o uuid é unico vira com certeza um unico registro
            //const user = rows[0]
            const [ user ] = rows; 

            return user;

        } catch (error) {
            //vamos receber o erro em uma instancia
            //trata-lo e nao deixar a app cair
            //esse erro é tratado na aplicacao - na chamada da rota
            throw new DatabaseError('Erro na consulta por ID', error);
        } finally {
            //se tudo der certo faz um commit no BD
            db.query('commit');
        }
    }

    //SELECIONAR PARA VALIDACAO USUARIO E SENHA DO BD
    async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            //para testar a senha na aplicacao vc pode usa-la como parametro de filtro do where, se nao coincidir, nao vem nada no select
            const query = `
            SELECT uuid, username
            FROM api_user
            WHERE username = $1
            AND password = crypt($2, 'my_salt')
            `;

            //parametros da query $1 e $2
            const values = [username, password];

            const { rows } = await db.query<User>(query, values);

            //como usuario e senha sao unicos por usuario, o resultado sera um só registro/linha
            const [user] = rows;

            //ternario, se usuario estiver vazio retorna vazio, senao retorna o usuario
            //return !user ? null : user;
            return user || null;

        } catch (error) {
            throw new DatabaseError('Erro na consulta de username e password', error);
        }
    }

    //INSERIR USUARIOS
    //cria um script de insert com os paramentros de cada campo $1 e $2
    //como o password $2 é encriptado, devemos chamar a funcao e passar a senha $2 e a chave de criptografia $3 - usar uma variavel de ambiente como chave
    //No final a query retorna o uuid gerado
   async create(user: User): Promise<string> {
        const script = `
            INSERT INTO api_user (
                username,
                password
            )
            VALUES ($1, crypt($2, 'my_salt'))
            RETURNING uuid
        `;
        //os parametros virao na chamada da funcao
        const values = [user.username, user.password];

        //desconstruindo o array
        const { rows } = await db.query<{uuid: string}>(script, values);

        //atribuimos a uma variavel o valor do novo uuid
        const [newUser] = rows;
        return newUser.uuid;
   }

    //UPDATE USUARIOS
    //cria um script de update com os paramentros de cada campo $1 e $2
    //como o password $2 é encriptado, devemos chamar a funcao e passar a senha $2 e a chave de criptografia $3 - usar uma variavel de ambiente como chave
    //No final a query nao retorna nada / so monitoramos em caso de erro
   async update(user: User): Promise<void> {
        const script = `
            UPDATE api_user
            SET 
                username = $1,
                password = crypt($2, 'my_salt')
            WHERE uuid = $3
        `;
        //os parametros virao na chamada da funcao
        const values = [user.username, user.password, user.uuid];

        //como nao tem retorno, somente chamamos o metodo e passamos os parametros (sql, argumentos)
        await db.query(script, values);
   }

   //DETETAR USUARIOS
   //a palavra delete é palavra-chave em muitas linguagens, entao nao usamos como nome de funcao
   //o delete precisa somente do id do usario para fazer a remocao e tambem nao tem retono
   async remove(uuid: string): Promise<void> {
        const script = `
            DELETE
            FROM api_user
            WHERE uuid = $1
        `;
        
        //o unico parametro necessario sera o uuid
        const values = [uuid];
        //como nao tem retorno é só chamar o metodo
        await db.query(script, values);
   }
}

//vamos exportar uma instacia dessa classe
export default new userRepository();