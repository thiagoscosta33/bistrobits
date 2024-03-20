const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/Grupo')
const Grupo = mongoose.model('grupo')
const { eAdmin } = require("../middlewares/eAdmin")

const { validarGrupo } = require('../middlewares/validationMiddleware');

const { enviarMensagemFlash, converterPreco } = require('../utils/util');

router.get('/', eAdmin, (req, res) => {
  Grupo.find().sort({ descricao: 'asc' }).then((grupos) => {
    const gruposJSON = JSON.parse(JSON.stringify(grupos)); // Limpar o objeto e cria uma copia seguira para renderizar
    res.render("grupos/grupo", { grupos: gruposJSON });
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as grupos")
    res.redirect("/")
  })
})

router.get('/add', eAdmin, (req, res) => {
  res.render("grupos/addgrupo")
})

const buscarGrupo = async (req) => {
  const { id } = req.params;
  const grupo = await Grupo.findOne({ _id: id });
  if (!grupo) {
    throw new Error('Grupo não encontrado');
  }
  return grupo;
};

router.get('/edit/:id', eAdmin, async (req, res) => {
  try {
    const grupoEncontrado = await buscarGrupo(req);
    const gruposJSON = JSON.parse(JSON.stringify(grupoEncontrado));
    res.render("grupos/editgrupo", { grupo: gruposJSON })
  } catch (err) {
    await enviarMensagemFlash(req, "error_msg", "Este grupo não existe!");
    res.redirect('/grupos');
  }
})

const deletarGrupo = async (req) => {
  const { id } = req.body;
  const grupo = await Grupo.findOneAndRemove({ _id: id });

  if (!grupo) {
    throw new Error('Grupo não encontrado');
  }
};

router.post("/deletar", eAdmin, async (req, res) => {
  try {
    await deletarGrupo(req);
    await enviarMensagemFlash(req, "success_msg", "Grupo removido com sucesso!");
    res.redirect('/grupos');
  } catch (err) {
    await enviarMensagemFlash(req, "error_msg", "Erro ao remover grupo!");
    res.redirect('/grupos');
  }
})


async function prepararDadosOriginais(req) {
  return {
    _id: req.body.id,
    descricao: req.body.descricao,
    listarNoCardapio: req.body.listarNoCardapio.toLowerCase() === 'on' ? true : false
  }
};

const alterarGrupo = async (req) => {
  const { id, descricao, listarNoCardapio } = req.body;
  const grupo = await Grupo.findOne({ _id: id });

  if (!grupo) {
    throw new Error('Grupo não encontrado');
  }

  grupo.descricao = descricao;
  grupo.listarNoCardapio = listarNoCardapio.toLowerCase() === 'on' ? true : false;
  await grupo.save();
};

router.post("/edit", eAdmin, validarGrupo, async (req, res) => {
  const erros = req.erros;

  if (erros && erros.length > 0) {
    const dadosOriginaisSubmetidos = await prepararDadosOriginais(req);
    res.render("grupos/editgrupo", { erros, grupo: gruposJSON });
  }

  try {
    await alterarGrupo(req);
    await enviarMensagemFlash(req, "success_msg", "Grupo alterado com sucesso!");
    res.redirect('/grupos');
  } catch (err) {
    await enviarMensagemFlash(req, "error_msg", "Erro ao alterar grupo!");
    res.redirect('/grupos');
  }
});


const criarGrupo = async (req) => {
  const { descricao, listarNoCardapio } = req.body;
  const novoGrupo = {
    descricao: descricao,
    listarNoCardapio: listarNoCardapio.toLowerCase() === 'on' ? true : false
  };

  await new Grupo(novoGrupo).save();
};

router.post("/novo", eAdmin, validarGrupo, async (req, res) => {
  const erros = req.erros;

  if (erros && erros.length > 0) {
    res.render("grupos/addgrupo", { erros });
  } else {
    try {
      await criarGrupo(req);
      await enviarMensagemFlash(req, "success_msg", "Grupo criado com sucesso!");
      res.redirect('/grupos');
    } catch (err) {
      await enviarMensagemFlash(req, "error_msg", "Erro ao criar grupo!");
      res.redirect('/grupos/novo');
    }
  }
});





module.exports = router;
