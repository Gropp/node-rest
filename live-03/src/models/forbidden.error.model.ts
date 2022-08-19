class ForbiddenError extends Error {

    constructor(
        //colocando o scopo public resolvemos o uso do this
        //nao precisa exportar?
        public message: string,
        public error?: any,
    ) {
        super(message);
    }
}
export default ForbiddenError;