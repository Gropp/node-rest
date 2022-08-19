//vamos criar uma classe extendida da Error do sistema para instanciar onde for preciso
class DatabaseError extends Error {

    constructor(
        //colocando o scopo public resolvemos o uso do this
        //nao precisa exportar?
        public message: string,
        public error?: any,
    ) {
        super(message);
    }
}
export default DatabaseError;