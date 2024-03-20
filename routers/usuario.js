const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuario')
const bcrypt = require('bcryptjs')
const passport = require("passport");

router.get("/registro", (req, res)=>{
    res.render("usuarios/registro")
})

router.get("/login", (req, res)=>{
    res.locals.showNavbar = false;
    res.render("usuarios/login")
})

router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        successFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error(err); // Lidar com qualquer erro que possa ocorrer
      }
      req.flash('success_msg', 'Deslogado com sucesso!')
      res.redirect("/");
    });
  });
  

router.post("/registro", (req, res)=>{
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome é inválido!"})
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email é inválido!"})
    }   
    
    if (req.body.senha.length < 4){
        erros.push({texto: "A senha deve conter no mínimo 4 dígitos!"})
    }   
    
    if (req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes!"})
    }        

    if (erros.length > 0){
        res.render("usuarios/registro", {erros, erros} )
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario)=>{
            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com esse email no nosso sistema!")
                res.redirect("/usuarios/registro")
            } else {
                const novoUsuario = {
                    nome: req.body.nome,
                    senha: req.body.senha,
                    email: req.body.email
                }
        
                bcrypt.genSalt(10, (erro, salt) =>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if (erro){
                            req.flash("error_msg", "Houve um erro ao registrar o usuário!")
                            res.redirect("/")
                        }
        
                        novoUsuario.senha = hash;
        
                        new Usuario(novoUsuario).save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso!")
                            res.redirect('/')
                        }).catch((err)=>{
                            req.flash("error_msg", "Erro ao registrar usuário!")
                            res.redirect('/usuarios/registro')
                        })
        
                    })
                })
            }

        }).catch((error)=>{
            req.flash("error_msg", "Houve um erro interno!")
            res.redirect("/")
        })

        

        
    } 

})

module.exports = router;