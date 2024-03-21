const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
require('../models/Produto')
const Produto = mongoose.model('produto')

require('../models/Grupo')
const Grupo = mongoose.model('grupo')

require('../models/Ingrediente')
const Ingrediente = mongoose.model('ingrediente')

const { eAdmin } = require("../middlewares/eAdmin")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Define o diretório onde os arquivos serão armazenados temporariamente
const fs = require('fs');

const {validarProduto} = require('../middlewares/validationMiddleware');

const { enviarMensagemFlash, converterPreco } = require('../utils/util');

router.get('/', eAdmin, (req, res) => {
  Produto.find().sort({ descricao: 'asc' }).populate('ingredientes').then((produtos) => {
    const produtosComPrecoFormatado = produtos.map(produto => {
      const precoFormatado = produto.preco ? `R$ ${produto.preco.toString().replace('.', ',')}` : null;
      const imagemURL = produto.fotos && produto.fotos.length > 0 ? `./uploads/${produto.fotos[0]}` : '/public/img/no-image.png';
      return { ...produto.toObject(), precoFormatado: precoFormatado, imagemURL: imagemURL };
    });
    res.render("produtos/produto", { produtos: produtosComPrecoFormatado });
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as produtos")
    res.redirect("/")
  })
})

router.get('/pesquisar', eAdmin, (req, res) => {
  let searchQuery = req.query.searchproduto; 

  searchQuery = searchQuery.toLowerCase();

  const searchFilter = searchQuery ? { descricao: { $regex: new RegExp(searchQuery, 'i') } } : {};

  Produto.find(searchFilter)
    .sort({ descricao: 'asc' })
    .populate('ingredientes')
    .then((produtos) => {
      const produtosComPrecoFormatado = produtos.map((produto) => {
        const precoFormatado = produto.preco ? `R$ ${produto.preco.toString().replace('.', ',')}` : null;
        const imagemURL = produto.fotos && produto.fotos.length > 0 ? `./../uploads/${produto.fotos[0]}` : '/public/img/no-image.png';
        return { ...produto.toObject(), precoFormatado: precoFormatado, imagemURL: imagemURL };
      });
      res.render('produtos/produto', { produtos: produtosComPrecoFormatado });
    })
    .catch((err) => {
      req.flash('error_msg', 'Houve um erro ao listar os produtos');
      res.redirect('/');
    });
});



router.get('/add', eAdmin, (req, res) => {
  Grupo.find().sort({ descricao: 'asc' }).then((grupos) => {
    const gruposJSON = JSON.parse(JSON.stringify(grupos));
    res.render("produtos/addproduto", { grupos: gruposJSON });
  }).catch((err) => {
    req.flash("error_msg", "Houve um erro ao listar as grupos")
    res.redirect("/")
  })
})

router.get('/edit/:idProduto', eAdmin, async (req, res) => {
  try {
    const produto = await Produto.findOne({ _id: req.params.idProduto }).populate('ingredientes');
    if (!produto) {
      req.flash("error_msg", "Este produto não existe!");
      return res.redirect("/produtos");
    }

    const grupos = await Grupo.find(); // Busca todos os grupos
    const gruposJSON = JSON.parse(JSON.stringify(grupos));

    const precoFormatado = produto.preco.toString().replace('.', ',');
    const produtosJSON = JSON.parse(JSON.stringify(produto));
    produtosJSON.precoFormatado = precoFormatado;

    res.render("produtos/editproduto", { produto: produtosJSON, grupos: gruposJSON });
  } catch (err) {
    req.flash("error_msg", "Ocorreu um erro ao encontrar o produto!");
    res.redirect("/produtos");
  }
});

const deletarProduto = async (req) => {
  const { id } = req.body;
  const produto = await Produto.findOneAndRemove({ _id: id });

  if (!produto) {
      throw new Error('Produto não encontrado');
  }

};

router.post("/deletar", eAdmin, async (req, res) => {
  try {
    await deletarProduto(req);
    await enviarMensagemFlash(req, "success_msg", "Produto removido com sucesso!");
    res.redirect('/produtos');
} catch (err) {
    await enviarMensagemFlash(req, "error_msg", "Erro ao remover produto!");
    res.redirect('/produtos');
}
})

async function prepararDadosOriginais(req) {
  const ingredientesIdsString = req.body.ingredientes;
  const ingredientesIdsArray = JSON.parse(ingredientesIdsString);
  const ObjectIds = ingredientesIdsArray.map(id => new mongoose.Types.ObjectId(id));
  const listIngredientes = await Ingrediente.find({ _id: { $in: ObjectIds } }).lean();
  const precoDecimal = mongoose.Types.Decimal128.fromString(converterPreco(req.body.preco));
  const precoFormatado = req.body.preco;
  const fotosPaths = req.body.nomeDasImagens ? JSON.parse(req.body.nomeDasImagens) : [];
  return {
    _id: req.body.idProduto,
    descricao: req.body.descricao,
    listarNoCardapio: req.body.listarNoCardapio === 'on',
    preco: precoDecimal,
    fotos: fotosPaths,
    ingredientes: listIngredientes,
    grupo: req.body.grupo,
    precoFormatado: precoFormatado
  }
};

router.post("/edit", eAdmin, validarProduto, async (req, res) => {
  try {
    const erros = req.erros;
    if (erros && erros.length > 0) {
      // Se houver erros de validação, retornar para a página de edição do produto
      const dadosOriginaisSubmetidos = await prepararDadosOriginais(req);
      const grupos = await Grupo.find();
      const gruposJSON = JSON.parse(JSON.stringify(grupos));
      return res.render("produtos/editproduto", { erros, produto: dadosOriginaisSubmetidos, grupos: gruposJSON });
    }

    // Se não houver erros de validação, continuar com a lógica para editar o produto                                                                              
    const { idProduto, descricao, preco, grupo, nomeDasImagens, ingredientes, listarNoCardapio } = req.body;
    const produto = await Produto.findOne({ _id: idProduto });
    if (!produto) {
      await enviarMensagemFlash(req, "error_msg", "Produto não encontrado!");
      return res.redirect("/produtos");
    }

    produto.descricao = descricao;
    produto.preco = mongoose.Types.Decimal128.fromString(converterPreco(preco));
    produto.grupo = grupo;
    produto.fotos = nomeDasImagens ? JSON.parse(nomeDasImagens) : [];
    produto.ingredientes = ingredientes ? JSON.parse(ingredientes) : [];
    produto.listarNoCardapio = listarNoCardapio === 'on';

    await produto.save();
    await enviarMensagemFlash(req, "success_msg", "Produto alterado com sucesso!");
    res.redirect("/produtos");
  } catch (err) {
    await enviarMensagemFlash(req, "error_msg", "Erro ao alterar produto!");    
    res.redirect("/produtos");
  }
});


async function criarProduto(req) {
  const precoDecimal = mongoose.Types.Decimal128.fromString(converterPreco(req.body.preco));
  const fotosPaths = req.body.nomeDasImagens ? JSON.parse(req.body.nomeDasImagens) : [];
  const ingredientes = req.body.ingredientes ? JSON.parse(req.body.ingredientes) : [];

  const novoProduto = {
    descricao: req.body.descricao,
    listarNoCardapio: req.body.listarNoCardapio === 'on',
    preco: precoDecimal,
    fotos: fotosPaths,
    ingredientes: ingredientes,
    grupo: req.body.grupo
  };

  return await new Produto(novoProduto).save();
}

router.post("/novo", eAdmin, validarProduto, async (req, res) => {
  const erros = req.erros; // pegar os erros do middleware

  if (erros && erros.length > 0) {
    res.render("produtos/addproduto", { erros });
  } else {
    try {
      await criarProduto(req);
      await enviarMensagemFlash(req, "success_msg", "Produto criado com sucesso!");
      res.redirect('/produtos');
    } catch (err) {
      await enviarMensagemFlash(req, "error_msg", "Erro ao criar produto!");
      res.redirect('/produtos/add');
    }
  }
});


router.delete('/produtos/:id/fotos/:nomeArquivo', eAdmin, (req, res) => {
  const { id, nomeArquivo } = req.params;

  Produto.findOne({ _id: id })
    .then((produto) => {
      if (!produto) {
        return res.status(404).send('Produto não encontrado');
      }

      const index = produto.fotos.indexOf(nomeArquivo);
      if (index !== -1) {
        produto.fotos.splice(index, 1);
      }

      produto.save()
        .then(() => {
          console.log('Foto removida com sucesso do array de fotos do produto');
          res.sendStatus(200);
        })
        .catch((err) => {
          console.error('Erro ao salvar o produto:', err);
          res.status(500).send('Erro ao salvar o produto');
        });
    })
    .catch((err) => {
      console.error('Erro ao encontrar o produto:', err);
      res.status(500).send('Erro ao encontrar o produto');
    });
});

router.post('/fotos/upload', upload.single('foto'), (req, res) => {
  const nomeArquivo = req.file.filename;
  res.json({ nomeArquivo: nomeArquivo });
});

router.delete('/remover/file/:nomeArquivo', (req, res) => {
  const nomeArquivo = req.params.nomeArquivo;
  fs.unlink(`uploads/${nomeArquivo}`, (err) => {
    if (err) {
      console.error('Erro ao excluir foto do servidor:', err);
      res.status(500).send('Erro ao excluir foto do servidor');
    } else {
      console.log('Foto excluída com sucesso');
      res.sendStatus(200);
    }
  });
});


module.exports = router;
