const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const passport = require("passport");

// Model de usuário
require("../models/Usuario");
const Usuario = mongoose.model('usuario')

module.exports = function (passport) {
  passport.use(new localStrategy({ usernameField: 'email', passwordField: "senha" }, (email, senha, done) => {
    Usuario.findOne({ email: email }).then((usuario) => {
      if (!usuario) {
        return done(null, false, { message: "Esta conta não existe!" });
      }
      bcrypt.compare(senha, usuario.senha, (erro, ok) => {
        if (ok) {
          return done(null, usuario);
        } else {
          return done(null, false, { message: "Senha incorreta!" });
        }
      });
    });
  }));

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await Usuario.findById(id);
      done(null, usuario);
    } catch (err) {
      done(err, null);
    }
  });
  
};
