module.exports = {
    eAdmin: function (req, res, next){
        
        //if (process.env.TESTING_MODE === 'true') {
        //    return next(); // Se estiver no modo de teste, pule a autenticação
        //}

        if (req.isAuthenticated()){    
            return next();
        }
        req.flash("error_msg", "Você deve estar logado e ter permissão administrador para ter acesso a esta funcionalidade!")
        res.redirect("/")
    }
}