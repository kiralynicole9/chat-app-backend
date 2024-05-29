const postgres = require('postgres');
const { init } = require('../repository/repository');

module.exports = {
    init() {
        this.db = postgres({
            host: 'db',
            username: 'root',
            password: 'root',
            port: 5432,
            database: 'chatapp',
        });
        
        return this;
    },

    async select(table, data) {
        const where = Object.keys(data || {})?.reduce((acc, curr, key, arr) => {
            return acc ? this.db`${acc} AND ${this.db(curr)}=${data[curr]}`: this.db`${this.db(curr)}=${data[curr]}`;
        }, '')

        if (where) {
            return await this.db`SELECT * FROM ${this.db(table)} WHERE ${where}`;
        } else {
            return await this.db`SELECT * FROM ${this.db(table)}`;
        }    

        //return await this.db`SELECT * FROM ${this.db(table)} ${this.db(where ? `WHERE ${where} }` : 'where 1=1' )}`
    },

    async insert(table, data) {

        console.log('data', data);
        const fields = Object.keys(data);

        return this.db`INSERT INTO ${this.db(table)} ${this.db(data, fields)}`;
    },

    async delete(table, where) {
        return this.db`DELETE FROM ${table} WHERE ${where}`;
    },

    async update(table, where) {
        return this.db`UPDATE ${table} SET ${fields} WHERE ${where}`;
    }
}