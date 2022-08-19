import User from "../models/user.model";

class userRepository {

    findAllUsers(): User[] {
        return [];
    }
}

//vamos exportar uma instacia dessa classe
export default new userRepository();