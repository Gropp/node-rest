//arquivo de extensao do EXPRESS
//vamos adicionar o tributo user do tipo User OPCIONAL dentro do REQUEST da biblioteca
import { User } from "../models/user.model";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User
    }
}