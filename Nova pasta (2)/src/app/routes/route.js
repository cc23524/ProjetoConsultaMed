const selecter = require("../../app/db/select");

module.exports = (app) => {
    app.use((req, res, next) => {res.header("Access-Control-Allow-Origin", "*");
        next();
    });

    const obj = require("../controllers/controller");
    const objController = new obj();

    app.post("/home", (req, res) => {res.render("home")});

    app.get("/", (req, res) => {res.render("logon/login")});

    app.get("/registerQ", objController.RegisterQ());
    app.get("/registerP", objController.RegisterP());
    app.get("/registerM", objController.RegisterM());

    app.get("/query", objController.tabQ);
    app.get("/patient", objController.tabP);
    app.get("/doctor", objController.tabM);
    
    app.post('/addQ', objController.addQ());
    app.post('/addP', objController.addP());
    app.post('/addM', objController.addM());

    app.post('/editQ/:id', objController.showEditQ());
    app.post('/editP/:id', objController.showEditP());
    app.post('/editM/:id', objController.showEditM());

    app.post('/updateQ/:id', objController.updateQ());
    app.post('/updateP/:id', objController.updateP());
    app.post('/updateM/:id', objController.updateM());

    app.post('/removeQ/:id', objController.removeQ());
    app.post('/removeP/:id', objController.removeP());
    app.post('/removeM/:id', objController.removeM());

    app.get('/checkNickname', async (req, res) => {
        const nickname = req.query.nickname;
    
        const clienter = await selecter.init();
        const exists = await clienter.nicknameExists(nickname);
    
        if (exists) {
            return res.status(400).json({message: "Esse usuário já existe!"});
        } else {
            return res.status(200).json({message: "Usuário disponível!"});
        }
    });

    app.get('/checkEmail', async (req, res) => {
        const email = req.query.email;
    
        const clienter = await selecter.init();
        const exists = await clienter.emailExists(email);
    
        if (exists) {
            return res.status(400).json({message: "Esse e-mail já está em uso!"});
        } else {
            return res.status(200).json({message: "E-mail disponível!"});
        }
    });

    app.post('/login', async (req, res) => {
        const { nickname, senha } = req.body;
    
        if (nickname === 'adm' && senha === 'adm') {
            res.render('homes/adm');
            return;
        }
        try {
            const clienter = await selecter.init();
            const user = await clienter.validateLogin(nickname, senha);
    
            if (user) {
                const userType = user.userType;

                if (userType === 'paciente') {
                    res.render('homes/patient', { user: user.user });
                } else if (userType === 'médico') {
                    res.render('homes/doctor', { user: user.user });
                }
            } else {
                res.status(401).json({ message: 'Nome de usuário ou senha inválidos' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ocorreu um erro durante a autenticação' });
        }
    });
};