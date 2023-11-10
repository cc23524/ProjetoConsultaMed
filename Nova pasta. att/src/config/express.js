const selecter = require("../app/db/select");
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const expressLayout = require("express-ejs-layouts");
app.use (expressLayout);

app.set("view engine", "ejs");
app.use(express.static('public'));

const rotas = require("../app/routes/route");
rotas(app);

module.exports = app;