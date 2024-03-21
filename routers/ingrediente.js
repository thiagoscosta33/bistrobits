const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/Ingrediente')
const Ingrediente = mongoose.model('ingrediente')
const { eAdmin } = require('../middlewares/eAdmin')

const { validarIngrediente } = require('../middlewares/validationMiddleware');

const { enviarMensagemFlash, converterPreco } = require('../utils/util');

router.get("/", eAdmin, (req, res) => {
    Ingrediente.find().sort({ descricao: 'asc' }).then((ingredientes) => {
        const jsonIngredientes = JSON.parse(JSON.stringify(ingredientes))
        res.render("ingredientes/ingrediente", { ingredientes: jsonIngredientes })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar os ingredientes!")
        res.redirect("./")
    })
})

router.get('/pesquisar', eAdmin, (req, res) => {
    let searchQuery = req.query.searchIngrediente;
  
    searchQuery = searchQuery.toLowerCase();
  
    const searchFilter = searchQuery ? { descricao: { $regex: new RegExp(searchQuery, 'i') } } : {};
  
    Ingrediente.find(searchFilter)
      .sort({ descricao: 'asc' })
      .then((ingredientes) => {
        const jsonIngredientes = JSON.parse(JSON.stringify(ingredientes))
        res.render("ingredientes/ingrediente", { ingredientes: jsonIngredientes })
      })
      .catch((err) => {
        req.flash('error_msg', 'Houve um erro ao listar os ingredientes');
        res.redirect('/');
      });
  });

router.get("/obter_ingredientes", eAdmin, (req, res) => {
    Ingrediente.find().sort({ descricao: 'asc' }).then((ingredientes) => {
        res.json(ingredientes);
    }).catch((err) => {
        res.status(500).json({ error: "Houve um erro ao listar os ingredientes!" });
    });
});

router.get("/obter_ingredientes/:id", eAdmin, (req, res) => {
    Ingrediente.findOne({ _id: req.params.id }).then((ingrediente) => {
        res.json(ingrediente);
    }).catch((err) => {
        res.status(500).json({ error: "Houve um erro ao listar os ingredientes!" });
    })
})


router.get("/add", eAdmin, (req, res) => {
    res.render("ingredientes/addingrediente")
})

router.get("/edit/:id", eAdmin, (req, res) => {
    Ingrediente.findOne({ _id: req.params.id }).then((ingrediente) => {
        const ingredienteJson = JSON.parse(JSON.stringify(ingrediente))
        res.render("ingredientes/editingrediente", { ingrediente: ingredienteJson })
    }).catch((err) => {
        req.flash("error_msg", "Este ingrediente não existe!")
        res.redirect("/ingredientes")
    })
})


const deletarIngrediente = async (req) => {
    const { id } = req.body;
    const ingrediente = await Ingrediente.findOneAndRemove({ _id: id });

    if (!ingrediente) {
        throw new Error('Ingrediente não encontrado');
    }
};

router.post("/deletar", eAdmin, async (req, res) => {
    try {
        await deletarIngrediente(req);
        await enviarMensagemFlash(req, "success_msg", "Ingrediente removido com sucesso!");
        res.redirect('/ingredientes');
    } catch (err) {
        await enviarMensagemFlash(req, "error_msg", "Erro ao remover ingrediente!");
        res.redirect('/ingredientes');
    }
})


const alterarIngrediente = async (req) => {
    const { id, descricao } = req.body;
    const ingrediente = await Ingrediente.findOne({ _id: id });

    if (!ingrediente) {
        throw new Error('Ingrediente não encontrado');
    }

    ingrediente.descricao = descricao;
    await ingrediente.save();
};


router.post("/edit", eAdmin, async (req, res) => {
    try {
        await alterarIngrediente(req);
        await enviarMensagemFlash(req, "success_msg", "Ingrediente alterado com sucesso!");
        res.redirect('/ingredientes');
    } catch (err) {
        await enviarMensagemFlash(req, "error_msg", "Erro ao alterar ingrediente!");
        res.redirect('/ingredientes');
    }
})

const criarIngrediente = async (req) => {
    const { descricao } = req.body;
    const novoIngrediente = {
        descricao: descricao
    };

    await new Ingrediente(novoIngrediente).save();
};

router.post("/novo", eAdmin, validarIngrediente, async (req, res) => {
    const erros = req.erros;

    if (erros && erros.length > 0) {
        res.render("ingredientes/addingrediente", { erros });
    } else {
        try {
            await criarIngrediente(req);
            await enviarMensagemFlash(req, "success_msg", "Ingrediente criado com sucesso!");
            res.redirect('/ingredientes');
        } catch (err) {
            await enviarMensagemFlash(req, "error_msg", "Erro ao criar ingrediente!");
            res.redirect('/ingredientes/novo');
        }
    }
});


module.exports = router;