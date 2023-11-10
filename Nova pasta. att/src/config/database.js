const sql = require('mssql');

const config = {
    server: 'regulus.cotuca.unicamp.br',
    database: 'BD23514',
    user: 'BD23514',
    password: 'BD23514',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

let pool;

const getPool = async () => {
    if (pool) return pool;
    try {
        pool = await sql.connect(config);
        console.log("Banco de dados conectado com sucesso!");
        return pool;
    } catch (err) {
        console.log(`Não conectou no banco de dados. Erro: ${err}`);
        throw err;
    }
}

module.exports = getPool;