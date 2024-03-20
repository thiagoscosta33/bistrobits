const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const grupo = require('./routers/grupo');
const produto = require('./routers/produto');
const ingrediente = require("./routers/ingrediente")
const usuario = require('./routers/usuario');
const cardapio = require('./routers/cardapio');
const path = require('path');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require("passport");
require("./config/auth")(passport)
const db = require("./config/db")
const money = require('money-math');
const helpers = require('./helpers/frontendHelpers');

//certificado
const https = require('https');
const protocolOptions = require('./config/protocol');

//sessao
app.use(session({
    secret: "V3ryS3cr3tS3ss10nK3y!",
    resave: true,
    saveUninitialized: true

}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//midleware
app.use((req, res, next) => {
    res.locals.showNavbar = true;
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
})

// Configurações bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuração do Handlebars
//app.engine('handlebars', engine({ extname: '.handlebars', defaultLayout: "main", helpers: {frontendHelpers}}));
app.engine('handlebars', engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: helpers
}));
app.set('view engine', 'handlebars');
app.set("views", "./views");

mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI).then(() => {
    console.log('conectado ao banco de dados')
}).catch((err) => {
    console.log('Erro ao conectar ao banco de dados. ' + err)
})

//public
//app.use(express.static(path.join(__dirname, "/public")));
app.use('/public', express.static('public'))
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/popper', express.static(path.join(__dirname, 'node_modules/popper.js/dist')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use('/fontawesome', express.static(path.join(__dirname, '/node_modules/@fortawesome/fontawesome-free')));
app.use('/vanilla-masker', express.static(path.join(__dirname, 'node_modules/vanilla-masker/build')));
app.use('/uploads', express.static('uploads'));


//rotas
app.get("/", (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render("index");
    } else {
        res.locals.showNavbar = false;
        res.render("welcome/welcome");
    }
});

app.use('/produtos', produto);
app.use('/grupos', grupo);
app.use('/ingredientes', ingrediente);
app.use('/usuarios', usuario);
app.use('/cardapio', cardapio);


// Servidor HTTPS
https.createServer(protocolOptions, app).listen(443);

// Servidor HTTP
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log('Servidor rodando na porta:', PORT);
});

module.exports = app;