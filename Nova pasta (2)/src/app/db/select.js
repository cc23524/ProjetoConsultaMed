const mssql = require('mssql');
const getPool = require("../../config/database");
const nodemailer = require('nodemailer');
class select {

    constructor(pool) {
        this._db = pool;
    }

    static async init() {
        const pool = await getPool();
        return new select(pool);
    }

    mail() {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'endrew.s2302@gmail.com',
              pass: 'iM74m%hC5nNgixxZ!i',
            },
          });
                  
          const mailOptions = {
            from: 'endrew.s2302@gmail.com',
            to: 'emailPatient@example.com',
            subject: 'Consulta registrada!',
            text: `
              Sua consulta médica foi registrada com sucesso!
              Data e Hora: ${formattedDate}
              Médico: ${nomeMedico} (Substitua com o nome do médico)
              Paciente: ${nomePatient} (Substitua com o nome do paciente)
              Tipo: ${nomeTypeQ} (Substitua com o tipo da consulta)
              Status: ${nomeStatus} (Substitua com o status da consulta)
            `,
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log('Erro ao enviar o email:', error);
            } else {
              console.log('Email enviado com sucesso:', info.response);
            }
          });
    }
    async validateLogin(usuario, senha) {
        return new Promise((resolve, reject) => {
            const request = new mssql.Request(this._db);
            request.input('usuario', mssql.NVarChar, usuario);
            request.input('senha', mssql.NVarChar, senha);
    
            const querySql = `
                SELECT 'paciente' as userType, p.nickname, p.senha
                FROM nodeQuery.patient AS p
                WHERE p.nickname = @usuario AND p.senha = @senha
                UNION ALL
                SELECT 'médico' as userType, d.email, d.senha
                FROM nodeQuery.doctor AS d
                WHERE d.email = @usuario AND d.senha = @senha
            `;
    
            request.query(querySql, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(`Erro ao verificar o login. Erro: ${err}`);
                }
    
                if (result.recordset.length === 1) {
                    const user = result.recordset[0];
                    const typeUser = user.userType;

                    const insertSql = 'INSERT INTO nodeQuery.acess (usuario, senha, typeUser) VALUES (@usuario, @senha, @typeUser)';
                    const insertRequest = new mssql.Request(this._db);
                    insertRequest.input('usuario', mssql.NVarChar, usuario);
                    insertRequest.input('senha', mssql.NVarChar, senha);
                    insertRequest.input('typeUser', mssql.NVarChar, typeUser);
                    
                    insertRequest.query(insertSql, (err) => {
                        if (err) {
                            console.log(err);
                            return reject(`Erro ao registrar o login na tabela de acess. Erro: ${err}`);
                        }
                        
                        resolve({ userType: typeUser, user });
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    async nicknameExists(nickname) {
        return new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from nodeQuery.patient where nickname = @nickname';
            const request = new mssql.Request(this._db);
            request.input('nickname', mssql.NVarChar, nickname);
            
            request.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(`Erro ao verificar a existência do nickname. Erro: ${err}`);
                }
                const count = result.recordset[0].count;
                resolve(count > 0);
            });
        });
    }

    async emailExists(email) {
        return new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from nodeQuery.patient where email = @email';
            const request = new mssql.Request(this._db);
            request.input('email', mssql.NVarChar, email);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(`Erro ao verificar a existência do email. Erro: ${err}`);
                }
                const count = result.recordset[0].count;
                resolve(count > 0);
            });
        });
    }

    idTypesQ() {
        return new Promise((resolve, reject) => {
            const sql = 'select idTypeQ, nome from nodeQuery.typeQuery';
            const request = new mssql.Request(this._db);

            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar todos os tipos de consulta:", err)
                    return reject(err)
                }

                if (result.recordset.length > 0) {
                    resolve(result.recordset)
                } else {
                    resolve([]);
                }
            });
        });
    };

    status() {
        return new Promise((resolve, reject) => {
            const sql = 'select idStatusQ, nome from nodeQuery.statusQuery';
            
            const request = new mssql.Request(this._db);
            
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar todos os status de consulta:", err);
                    return reject(err);
                }
                
                if(result.recordset.length > 0) {
                    resolve(result.recordset);
                } else {
                    resolve([]);
                }
            });
        });
    }

    med() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT M.idM, M.nome as nomeMed, M.sobrenome as sobrenomeMed, T.nome as nomeType
                FROM nodeQuery.doctor M
                INNER JOIN nodeQuery.typeDoctor T ON M.idType = T.idType
            `;
    
            const request = new mssql.Request(this._db);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar todos os médicos:", err);
                    return reject(err);
                }
    
                if (result.recordset.length > 0) {
                    resolve(result.recordset);
                } else {
                    resolve([]);
                }
            });
        });
    }

    patients() {
        return new Promise((resolve, reject) => {
            const sql = 'select idP, nome, sobrenome FROM nodeQuery.patient';
    
            const request = new mssql.Request(this._db);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar todos os pacientes:", err);
                    return reject(err);
                }
    
                resolve(result.recordset);
            });
        });
    }

    date(dateString) {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    hour(timeString) {
        const date = new Date(timeString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    tableQ() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT q.idC as idC, q.dadosConsulta as dadosConsulta,
                p.idP as idP, p.nome as nomePatient, p.sobrenome as sobrenomePatient,
                d.idM as idM, d.nome as nomeMed, d.sobrenome as sobrenomeMed,
                s.idStatusQ as idStatusQ, s.nome as nomeStatus,
                t.idTypeQ as idTypeQ, t.nome as nomeTypeQ,
                e.nome as nomeTypeDoctor
                FROM nodeQuery.query q
                INNER JOIN nodeQuery.patient p ON q.idP = p.idP
                INNER JOIN nodeQuery.statusQuery s ON q.idStatusQ = s.idStatusQ
                INNER JOIN nodeQuery.typeQuery t ON q.idTypeQ = t.idTypeQ
                INNER JOIN nodeQuery.doctor d ON q.idM = d.idM
                INNER JOIN nodeQuery.typeDoctor e ON q.idType = e.idType
                ORDER BY q.idC
            `;

            const request = new mssql.Request(this._db);
            request.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(`Erro, não foi possível ver a lista. Erro: ${err}`);
                }

                for (let query of result.recordset) {
                    query.dataC = this.date(query.dadosConsulta);
                    query.horaC = this.hour(query.dadosConsulta);
                }
                resolve(result.recordset);
            });
        });
    }

    tableP() {
        return new Promise((resolve, reject) => {
            const sql = 'select * from nodeQuery.patient order by idP';

            const request = new mssql.Request(this._db);
            request.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(`Erro, não foi possível ver a lista. Erro: ${err}`);
                }
                resolve(result.recordset);
            });
        });
    }

    tableM() {
        return new Promise((resolve, reject) => {
            const sql = 'select d.*, t.nome AS nomeType from nodeQuery.doctor d left join nodeQuery.typeDoctor t on d.idType = t.idType order by d.idM';

            const request = new mssql.Request(this._db);
            request.query(sql, (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(`Erro, não foi possível ver a lista. Erro: ${err}`);
                }

                resolve(result.recordset);
            });
        });
    }

    addQ(dadosConsulta, idM, idP, idTypeQ, idStatusQ) {
        return new Promise(async (resolve, reject) => {
          const idType = await this.getIdType(idM);
          
          const sql = `
              INSERT INTO nodeQuery.query (dadosConsulta, idM, idType, idP, idTypeQ, idStatusQ)
              VALUES (@dadosConsulta, @idM, @idType, @idP, @idTypeQ, @idStatusQ)
          `;
          const formattedDate = new Date(dadosConsulta).toISOString().slice(0, 19).replace("T", " ");
      
          const request = new mssql.Request(this._db);
          request.input('dadosConsulta', mssql.NVarChar, formattedDate);
          request.input('idM', mssql.Int, idM);
          request.input('idType', mssql.Int, idType);
          request.input('idP', mssql.Int, idP);
          request.input('idTypeQ', mssql.Int, idTypeQ);
          request.input('idStatusQ', mssql.Int, idStatusQ);
      
          request.query(sql, (err) => {
            if (err) {
              console.log("Erro durante a execução da query:", err);
              return reject(err);
            }
            resolve();
          });
        });
    }

    addP(nome, sobrenome, email, cpf, nickname, senha) {
        return new Promise((resolve, reject) => {
            const sql = `insert into nodeQuery.patient (nome, sobrenome, email, cpf, nickname, senha)
                         values (@nome, @sobrenome, @email, @cpf, @nickname, @senha)`;

            const request = new mssql.Request(this._db);
            request.input('nome', mssql.NVarChar, nome);
            request.input('sobrenome', mssql.NVarChar, sobrenome);
            request.input('email', mssql.NVarChar, email);
            request.input('cpf', mssql.NVarChar, cpf);
            request.input('nickname', mssql.NVarChar, nickname);
            request.input('senha', mssql.NVarChar, senha);

            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro durante a execução da query:", err);
                    return reject(err);
                }

                resolve(result);
            });
        });
    }

    addM(nome, sobrenome, crm, idType, email, senha) {
        return new Promise((resolve, reject) => {
            const sql = `insert into nodeQuery.doctor (nome, sobrenome, crm, idType, email, senha)
                         values (@nome, @sobrenome, @crm, @idType, @email, @senha)`;

            const request = new mssql.Request(this._db);
            request.input('nome', mssql.NVarChar, nome);
            request.input('sobrenome', mssql.NVarChar, sobrenome);
            request.input('crm', mssql.Int, crm);
            request.input('idType', mssql.Int, idType);
            request.input('email', mssql.NVarChar, email);
            request.input('senha', mssql.NVarChar, senha);

            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro durante a execução da query:", err);
                    return reject(err);
                }

                resolve(result);
            });
        });
    }

    idQ(idC) {
        return new Promise((resolve, reject) => {
            const sql = 'select * from nodeQuery.query where idC = @idC';
    
            const request = new mssql.Request(this._db);
            request.input('idC', mssql.Int, idC);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar consulta por ID:", err);
                    return reject(err);
                }
    
                if(result.recordset.length > 0) {
                    const client = result.recordset[0];
                    resolve(client);
                } else {
                    reject(new Error('Consulta não encontrada'));
                }
            });
        });
    };

    idP(idP) {
        return new Promise((resolve, reject) => {
            const sql = 'select * from nodeQuery.patient where idP = @idP';
    
            const request = new mssql.Request(this._db);
            request.input('idP', mssql.Int, idP);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar paciente por ID:", err);
                    return reject(err);
                }
    
                if(result.recordset.length > 0) {
                    const client = result.recordset[0];
                    resolve(client);
                } else {
                    reject(new Error('Paciente não encontrado'));
                }
            });
        });
    };

    idM(idM) {
        return new Promise((resolve, reject) => {
            const sql = 'select * from nodeQuery.doctor where idM = @idM';
    
            const request = new mssql.Request(this._db);
            request.input('idM', mssql.Int, idM);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar médico por ID:", err);
                    return reject(err);
                }
    
                if(result.recordset.length > 0) {
                    const client = result.recordset[0];
                    resolve(client);
                } else {
                    reject(new Error('Médico não encontrado'));
                }
            });
        });
    };

    idTypes() {
        return new Promise((resolve, reject) => {
            const sql = 'select idType, nome from nodeQuery.typeDoctor';
            
            const request = new mssql.Request(this._db);
            
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar todos os tipos de médico:", err);
                    return reject(err);
                }
                
                if(result.recordset.length > 0) {
                    resolve(result.recordset);
                } else {
                    resolve([]);
                }
            });
        });
    }

    editQ(idC, dadosConsulta, idM, idTypeQ, idStatusQ) {
        return new Promise(async (resolve, reject) => {
            const idType = await this.getIdType(idM);
    
            const formattedDate = new Date(dadosConsulta).toISOString().slice(0, 19).replace("T", " ");
    
            const sql = `
                update nodeQuery.query set dadosConsulta = @dadosConsulta, idM = @idM, idType = @idType, idTypeQ = @idTypeQ, idStatusQ = @idStatusQ where idC = @idC
            `;
    
            const request = new mssql.Request(this._db);
            request.input('idC', mssql.Int, idC);
            request.input('dadosConsulta', mssql.NVarChar, formattedDate);
            request.input('idM', mssql.Int, idM);
            request.input('idType', mssql.Int, idType);
            request.input('idTypeQ', mssql.Int, idTypeQ);
            request.input('idStatusQ', mssql.Int, idStatusQ);
    
            request.query(sql, (err) => {
                if (err) {
                    console.log("Erro durante a edição:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    }
    
    getIdType(idM) {
        return new Promise((resolve, reject) => {
            const sql = 'select idType from nodeQuery.doctor where idM = @idM';
            const request = new mssql.Request(this._db);
            request.input('idM', mssql.Int, idM);
            
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao obter idType do médico:", err);
                    return reject(err);
                }
                
                if (result.recordset.length > 0) {
                    resolve(result.recordset[0].idType);
                } else {
                    reject(new Error('Médico não encontrado ou idType não definido.'));
                }
            });
        });
    }

    passwordID(idP) {
        return new Promise((resolve, reject) => {
            const sql = 'select senha from nodeQuery.patient where idP = @idP';
    
            const request = new mssql.Request(this._db);
            request.input('idP', mssql.Int, idP);
    
            request.query(sql, (err, result) => {
                if (err) {
                    console.log("Erro ao buscar senha do paciente:", err);
                    return reject(err);
                }
                if(result.recordset.length > 0) {
                    resolve(result.recordset[0].senha);
                } else {
                    reject(new Error('Senha não encontrada'));
                }
            });
        });
    }

    editP(idP, nome, sobrenome, crm, idType, nickname, senha_nova) {
        return new Promise((resolve, reject) => {
            let sql;
    
            if (senha_nova && senha_nova.trim() !== "") {
                sql = `update nodeQuery.patient
                        set nome = @nome, sobrenome = @sobrenome, crm = @crm,
                            idType = @idType, nickname = @nickname, senha = @senha
                        where idP = @idP`;
            } else {
                sql = `update nodeQuery.patient
                        set nome = @nome, sobrenome = @sobrenome, crm = @crm,
                            idType = @idType, nickname = @nickname
                        where idP = @idP`;
            }
    
            const request = new mssql.Request(this._db);
            request.input('idP', mssql.Int, idP);
            request.input('nome', mssql.NVarChar, nome);
            request.input('sobrenome', mssql.NVarChar, sobrenome);
            request.input('crm', mssql.NVarChar, crm);
            request.input('idType', mssql.NVarChar, idType);
            request.input('nickname', mssql.NVarChar, nickname);
            if (senha_nova && senha_nova.trim() !== "") {
                request.input('senha', mssql.NVarChar, senha_nova);
            }
    
            request.query(sql, (err) => {
                if (err) {
                    console.log("Erro durante a edição:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    };

    editM(idM, nome, sobrenome, idType) {
        return new Promise((resolve, reject) => {
            const sql = `update nodeQuery.doctor set nome = @nome, sobrenome = @sobrenome,  idType = @idType where idM = @idM`;

            const request = new mssql.Request(this._db);
            request.input('idM', mssql.Int, idM);
            request.input('nome', mssql.NVarChar, nome);
            request.input('sobrenome', mssql.NVarChar, sobrenome);
            request.input('idType', mssql.Int, idType);

            request.query(sql, (err) => {
                if (err) {
                    console.log("Erro durante a edição:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    };

    removeQ(idC) {
        return new Promise((resolve, reject) => {
            const sql = 'Delete from nodeQuery.query where idC = @idC';

            const request = new mssql.Request(this._db);
            request.input('idC', mssql.Int, idC);

            request.query(sql, (err) => {
                if (err) {
                    console.log("Erro durante a remoção:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    };

    removeP(idP) {
        return new Promise((resolve, reject) => {
            const sql = 'Delete from nodeQuery.patient where idP = @idP';

            const request = new mssql.Request(this._db);
            request.input('idP', mssql.Int, idP);

            request.query(sql, (err) => {
                if (err) {
                    console.log("Erro durante a remoção:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    };

    removeM(idM) {
        return new Promise((resolve, reject) => {
            const sql = 'Delete from nodeQuery.doctor where idM = @idM';

            const request = new mssql.Request(this._db);
            request.input('idM', mssql.Int, idM);

            request.query(sql, (err) => {
                if (err) {
                    console.log("Erro durante a remoção:", err);
                    return reject(err);
                }
                resolve();
            });
        });
    };
};

module.exports = select;