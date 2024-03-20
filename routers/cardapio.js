const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Produto')
require('../models/Grupo')
require('../models/Ingrediente')

const Produto = mongoose.model('produto');
const Grupo = mongoose.model('grupo');
const Ingrediente = mongoose.model('ingrediente');

router.get("/", async (req, res) => {

    const grupos = await Grupo.find().exec();
    const gruposJSON = JSON.parse(JSON.stringify(grupos));
    const produtos = await Produto.find().populate('grupo').populate('ingredientes').exec();
    const produtosComPrecoFormatado = produtos.map(produto => {
        const precoFormatado = produto.preco ? `R$ ${produto.preco.toString().replace('.', ',')}` : null;
        return { ...produto.toObject(), precoFormatado: precoFormatado };
      });     
    const produtosJSON = JSON.parse(JSON.stringify(produtosComPrecoFormatado));       
    

    res.render("cardapios/cardapio", { layout: 'mobileMain', gruposJSON, produtosJSON})
})

module.exports = router;