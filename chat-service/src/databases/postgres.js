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
        this.query = this.db;
        
        return this;
    },

    async select(table, data) {

        if (data instanceof Array) {
            const wheress = data.map((item, index) => {
                const fields = Object.keys(item);
                return fields.reduce((acc, curr, key, arr) => {
                    if (item[curr] === null) {
                        return acc ? this.db`${acc} AND ${this.db(curr)} IS NULL` : this.db`${this.db(curr)} IS NULL`;
                    }
                    return acc ? this.db`${acc} AND ${this.db(curr)}=${item[curr]}` : this.db`${this.db(curr)}=${item[curr]}`;
                }, '')
            }).reduce((acc, curr, key, arr) => {
                return acc ? this.db`${acc} OR ${this.db`${curr}`}` : this.db`${curr}`;
            });
    
            return await this.db`SELECT * FROM ${this.db(table)} WHERE ${this.db`${wheress}`} ORDER BY id`;
        }

        const where = Object.keys(data || {})?.reduce((acc, curr, key, arr) => {
            if (data[curr] === null) {
                return acc ? this.db`${acc} AND ${this.db(curr)} IS NULL` : this.db`${this.db(curr)} IS NULL`;
            }
            return acc ? this.db`${acc} AND ${this.db(curr)}=${data[curr]}`: this.db`${this.db(curr)}=${data[curr]}`;
        }, '')

        if (where) {
            return await this.db`SELECT * FROM ${this.db(table)} WHERE ${where} ORDER BY id`;
        } else {
            return await this.db`SELECT * FROM ${this.db(table)} ORDER BY id`;
        }    
    },

    async insert(table, data) {

        console.log('data', data);
        const fields = Object.keys(data);

        const savedData = await this.db`INSERT INTO ${this.db(table)} ${this.db(data, fields)} returning id`;
        return savedData[0];
    },

    async delete(table, where) {
        return this.db`DELETE FROM ${table} WHERE ${where}`;
    },

    async update(table, data) {
        const {id, ...restData} = data;
        const fields = Object.keys(restData);
        console.log(`UPDATE ${this.db(table)} SET ${this.db(restData, fields)} WHERE id = ${id}`);
        return this.db`UPDATE ${this.db(table)} SET ${this.db(restData, fields)} WHERE id = ${id}`;
    }
}