
const selecter = require("../db/select.js");

class control_consult {

    
    tabQ() {
        return async function(req, res) {
            const clienter = await selecter.init();
            try {
                const resultados = await clienter.tableQ();
                console.log(resultados)
                res.render('../views/querys/queryQuery', {querys: resultados});
            } catch (erro) {
                console.log(erro);
                res.status(500).send("Ocorreu um erro ao mostrar a tabela: " + erro.message);
            }
        };
    };

    tabP() {
        return async function(req, res) {
            const clienter = await selecter.init();
            try {
                const resultados = await clienter.tableP();
                res.render('../views/querys/queryPatient', {patients: resultados});
            } catch (erro) {
                console.log(erro);
                res.status(500).send("Ocorreu um erro ao mostrar a tabela: " + erro.message);
            }
        };
    };

    tabM() {
        return async function(req, res) {
            const clienter = await selecter.init();
            try {
                const resultados = await clienter.tableM();
                res.render('../views/querys/queryDoctor', {doctors: resultados});
            } catch (erro) {
                console.log(erro);
                res.status(500).send("Ocorreu um erro ao mostrar a tabela: " + erro.message);
            };
        };
    };
    
    addQ() {
        return async function(req, res) {
            const {dadosConsulta, idM, idP, idTypeQ, idStatusQ} = req.body;
            
            const clienter = await selecter.init();
            try {
                await clienter.addQ(dadosConsulta, idM, idP, idTypeQ, idStatusQ);
                const updatedClients = await clienter.tableQ();
                res.render('../views/querys/queryQuery', {querys: updatedClients});
            } catch (error) {
                console.error("Erro ao adicionar consulta:", error);
                res.status(500).send("Ocorreu um erro ao adicionar: " + error.message);
            }
        };
    };

    addP() {
        return async function(req, res) {
            const {nome, sobrenome, email, cpf, nickname, senha} = req.body;
            const clienter = await selecter.init();
            try {
                await clienter.addP(nome, sobrenome, email, cpf, nickname, senha);
                const updatedPatients = await clienter.tableP();
                res.render('../views/logon/login', {patients: updatedPatients});
            } catch (error) {
                console.error("Erro ao adicionar paciente:", error);
                res.status(500).send("Ocorreu um erro ao adicionar: " + error.message);
            }
        };
    };

    addM() {
        return async function(req, res) {
            const {nome, sobrenome, crm, idType, email, senha} = req.body;
            const clienter = await selecter.init();
            try {
                await clienter.addM(nome, sobrenome, crm, idType, email, senha);
                const updatedDoctors = await clienter.tableM();
                res.render('../views/logon/login', {doctors: updatedDoctors});
            } catch (error) {
                console.error("Erro ao adicionar médico:", error);
                res.status(500).send("Ocorreu um erro ao adicionar: " + error.message);
            }
        };
    };

    showEditQ() {
        return async function(req, res) {
            const idQuery = req.params.id;
            const clienter = await selecter.init();
            try {
                const resultados = await clienter.idQ(idQuery);
                const med = await clienter.med();
                const typesQ = await clienter.idTypesQ();
                const status = await clienter.status();
                const querys = await clienter.tableQ();
                
                const dataHora = resultados.dadosConsulta;
                const formattedDateTime = dataHora.toISOString().slice(0, 16);
    
                console.log(resultados);
                res.render('../views/edits/editQuery', {query: resultados, med: med, typesQ: typesQ, status: status, querys: querys, formattedDateTime: formattedDateTime});
            } catch (error) {
                console.error("Ocorreu um erro ao buscar os detalhes da consulta:", error);
                res.status(500).send("Ocorreu um erro ao buscar os detalhes da consulta: " + error.message);
            }
        };
    };

    showEditP() {
        return async function(req, res) {
            const idPatient = req.params.id;
            const clienter = await selecter.init();
            try {
                const client = await clienter.idP(idPatient);
                res.render('../views/edits/editPatient', { patient: client });
            } catch (error) {
                console.error("Ocorreu um erro ao buscar os detalhes do paciente:", error);
                res.status(500).send("Ocorreu um erro ao buscar os detalhes do paciente: " + error.message);
            }
        };
    };

    showEditM() {
        return async function(req, res) {
            const idDoctor = req.params.id;
            const clienter = await selecter.init();
            try {
                const client = await clienter.idM(idDoctor);
                const types = await clienter.idTypes();
                res.render('../views/edits/editDoctor', { doctor: client, types: types });
            } catch (error) {
                console.error("Ocorreu um erro ao buscar os detalhes do médico:", error);
                res.status(500).send("Ocorreu um erro ao buscar os detalhes do médico: " + error.message);
            }
        };
    };

    RegisterQ() {
        return async function(req, res) {
            const clienter = await selecter.init();
            try {
                const typesQ = await clienter.idTypesQ();
                const status = await clienter.status();
                const med = await clienter.med();
                const query = await clienter.tableQ();
                const patients = await clienter.patients();

                const combinedData = {
                    query: query,
                    status: status,
                    med: med,
                    typesQ: typesQ,
                    querys: patients
                };

                res.render('../views/logon/registerQ', combinedData);
            } catch (error) {
                console.error("Ocorreu um erro ao buscar a consulta:", error);
                res.status(500).send("Ocorreu um erro ao buscar os detalhes da consulta: " + error.message);
            }
        };
    };

    RegisterP() {
        return async function(req, res) {
            try {
                res.render('../views/logon/registerP');
            } catch (error) {
                console.error("Ocorreu um erro ao buscar os detalhes do paciente:", error);
                res.status(500).send("Ocorreu um erro ao buscar os detalhes do paciente: " + error.message);
            }
        };
    };

    RegisterM() {
        return async function(req, res) {
            const clienter = await selecter.init();
            try {
                const types = await clienter.idTypes();
                res.render('../views/logon/registerM', {types: types});
            } catch (error) {
                console.error("Ocorreu um erro ao buscar os detalhes do médico:", error);
                res.status(500).send("Ocorreu um erro ao buscar os detalhes do médico: " + error.message);
            }
        };
    };

    updateQ() {
        return async function (req, res) {
            const idQuery = req.params.id;
            const { dadosConsulta, idM, idTypeQ, idStatusQ } = req.body;
            const clienter = await selecter.init();
            try {
                await clienter.editQ(idQuery, dadosConsulta, idM, idTypeQ, idStatusQ);
                res.redirect('/query');
            } catch (error) {
                console.error("Ocorreu um erro ao atualizar os detalhes da consulta:", error);
                res.status(500).send("Ocorreu um erro ao atualizar: " + error.message);
            }
        };
    };
    
    updateP() {
        return async function(req, res) {
            const idPatient = req.params.id;
            const { nome, sobrenome, email, cpf, nickname, senha_atual, senha_nova } = req.body;
            const clienter = await selecter.init();
    
            try {
                const currentPassword = await clienter.passwordID(idPatient);
    
                if (currentPassword !== senha_atual) {
                    return res.render('../views/edits/errorPage', { errorMessage: "A senha atual está incorreta." });
                }
            
                await clienter.editP(idPatient, nome, sobrenome, email, cpf, nickname, senha_nova);
                res.redirect('/patient');
            } catch (error) {
                console.error("Ocorreu um erro ao atualizar os detalhes do paciente:", error);
                res.status(500).send("Ocorreu um erro ao atualizar: " + error.message);
            }
        };
    }
    
    
    
    updateM() {
        return async function(req, res) {
            const idDoctor = req.params.id;
            const {nome, sobrenome, idType} = req.body;
            const clienter = await selecter.init();
            try {
                await clienter.editM(idDoctor, nome, sobrenome, idType);
                res.redirect('/');
            } catch (error) {
                console.error("Ocorreu um erro ao atualizar os detalhes do médico:", error);
                res.status(500).send("Ocorreu um erro ao atualizar: " + error.message);
            }
        };
    };
    
    removeQ() {
        return async function(req, res) {
            let queryID = req.params.id;
            queryID = parseInt(queryID);
    
            if (isNaN(queryID)) {
                console.error("ID fornecido não é um número válido:", req.params.id);
                return res.status(400).send("ID fornecido não é válido");
            }
            const clienter = await selecter.init();
            try {
                await clienter.removeQ(queryID);
                const updatedQ = await clienter.tableQ();
                res.render('../views/querys/queryQuery', {querys: updatedQ});
            } catch (error) {
                console.error("Erro ao remover consulta:", error);
                res.status(500).send("Ocorreu um erro ao remover: " + error.message);
            }
        };
    }

    removeP() {
        return async function(req, res) {
            let patientId = req.params.id;
            patientId = parseInt(patientId);
    
            if (isNaN(patientId)) {
                console.error("ID fornecido não é um número válido:", req.params.id);
                return res.status(400).send("ID fornecido não é válido");
            }
            const clienter = await selecter.init();
            try {
                await clienter.removeP(patientId);
                const updatedP = await clienter.tableP();
                res.render('../views/querys/queryPatient', {patients: updatedP});
            } catch (error) {
                console.error("Erro ao remover paciente:", error);
                res.status(500).send("Ocorreu um erro ao remover: " + error.message);
            }
        };
    }
    
    removeM() {
        return async function(req, res) {
            let idDoctor = req.params.id;
            idDoctor = parseInt(idDoctor);
    
            if (isNaN(idDoctor)) {
                console.error("ID fornecido não é um número válido:", req.params.id);
                return res.status(400).send("ID fornecido não é válido");
            }
            const clienter = await selecter.init();
            try {
                await clienter.removeM(idDoctor);
                const updatedD = await clienter.tableM();
                res.render('../views/querys/queryDoctor', {doctors: updatedD});
            } catch (error) {
                console.error("Erro ao remover médico:", error);
                res.status(500).send("Ocorreu um erro ao remover: " + error.message);
            }
        };
    }
    
}

module.exports = control_consult;