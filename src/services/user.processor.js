require("dotenv").config();
const bcrypt = require("bcrypt-nodejs");
const PostgresConnection = require("./postgres.processor");

class User {
    constructor() {
        this.connection = new PostgresConnection(process.env.DB_ENVIRONMENT);

        this.passwordHash = (ps) => {
            return bcrypt.hashSync(ps, bcrypt.genSaltSync(10));
        };
    }
    
    find = (filter = {}) => {
        return new Promise(async (resolve, reject) => {
            this.connection.searchByTerm("users", filter)
                .then(dt => resolve(dt))
                .catch(err => reject(err))
        });
    };

    create = ({ email, password }) => {
        return new Promise(async (resolve, reject) => {
            await this.connection.insert("users", { 
                email,
                password: password ? this.passwordHash(password) : undefined
            })
            .then(dt => resolve(dt))
            .catch(err => reject(err))
        });
    };

    subscribe = ({ id, subscription_id }) => {
        return new Promise(async (resolve, reject) => {
            await this.connection.update("users", { id: id }, { subscribed: true, subscription_id })
                .then(dt => resolve(dt))
                .catch(err => reject(err))
        });
    };

    unsubscribe = ({ id }) => {
        return new Promise(async (resolve, reject) => {
            await this.connection.update("users", { id: id }, { subscribed: false, subscription_id: null })
                .then(dt => resolve(dt))
                .catch(err => reject(err))
        });
    };

    remove = ({ id }) => {
        return new Promise(async (resolve, reject) => {
            await this.connection.delete("users", { id: id })
                .then(dt => resolve(dt))
                .catch(err => reject(err))
        });
    };
};

module.exports = User;