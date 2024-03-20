const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

require('../../models/Grupo')
const Grupo = mongoose.model('grupo')
const gruposRouter = require('../../routers/grupo');

require('../../models/Ingrediente')
const Ingrediente = mongoose.model('ingrediente')
const ingredientesRouter = require('../../routers/ingrediente');

require('../../models/Produto')
const Produto = mongoose.model('produto')
const produtosRouter = require('../../routers/produto');

const app = express();
app.use(express.json());
require('../setup');

// Mock apenas para a função enviarMensagemFlash
jest.mock('../../utils/util', () => ({
  enviarMensagemFlash: jest.fn(),
  converterPreco: jest.requireActual('../../utils/util').converterPreco
}));

// Mock da middleware eAdmin
jest.mock('../../middlewares/eAdmin', () => ({
  eAdmin: (req, res, next) => next()
}));

app.use('/produtos', produtosRouter);

app.use('/grupos', gruposRouter);

app.use('/ingredientes', ingredientesRouter);

let grupoId;

describe('Testes para as rotas de grupos', () => {
  it('Deve adicionar um novo grupo', async () => {
    const response = await request(app)
      .post('/grupos/novo')
      .send({
        descricao: 'Grupo de Teste',
        listarNoCardapio: 'ON'
      });

    // Verifica se o grupo foi salvo no banco de dados
    const grupoSalvo = await Grupo.findOne({ descricao: 'Grupo de Teste' });
    expect(grupoSalvo).toBeTruthy();
    expect(grupoSalvo.descricao).toBe('Grupo de Teste');
    expect(grupoSalvo.listarNoCardapio).toBe(true);
    grupoId = grupoSalvo._id;
  });

});


let produtoId;

describe('Testes para as rotas de produtos', () => {
  it('Deve adicionar um novo produto', async () => {
    const response = await request(app)
      .post('/produtos/novo')
      .send({
        descricao: 'Teste Produto',
        listarNoCardapio: 'on',
        preco: '10.00',
        nomeDasImagens: '["imagem1.jpg", "imagem2.jpg"]',
        ingredientes: '[]',
        grupo: grupoId,
      });

    // Verifica se o produto foi salvo no banco de dados
    const produtoSalvo = await Produto.findOne({ descricao: 'Teste Produto' });
    expect(produtoSalvo).toBeTruthy();
    expect(produtoSalvo.descricao).toBe('Teste Produto');
    produtoId = produtoSalvo._id;        
  });

  it('Deve alterar o produto', async () => {
    const response = await request(app)
      .post('/produtos/edit')
      .send({
        idProduto: produtoId,
        descricao: 'Produto alterado',
        listarNoCardapio: 'on',
        preco: '10.00',
        nomeDasImagens: '["imagem1.jpg", "imagem2.jpg"]',
        ingredientes: '[]',
        grupo: grupoId,
      });

    // Verifica se o produto foi altetado no banco de dados
    const produtoAlterado = await Produto.findOne({ _id: produtoId });
    expect(produtoAlterado).toBeTruthy();
    expect(produtoAlterado.descricao).toBe('Produto alterado');
  });



  it('Deve remover o produto', async () => {
    const response = await request(app)
      .post('/produtos/deletar')
      .send({
        id: produtoId
      });

    // Verifica se o produto foi removido do banco de dados
    const produtoRemovido = await Produto.findOne({ _id: produtoId });
    expect(produtoRemovido).toBeFalsy();
  });    

});

let ingredienteId;

describe('Testes para as rotas de ingredientes', () => {
  it('Deve adicionar um novo ingrediente', async () => {
    const response = await request(app)
      .post('/ingredientes/novo')
      .send({
        descricao: 'Ingrediente de Teste'
      });

    // Verifica se o ingrediente foi salvo no banco de dados
    const ingredienteSalvo = await Ingrediente.findOne({ descricao: 'Ingrediente de Teste' });
    expect(ingredienteSalvo).toBeTruthy();
    expect(ingredienteSalvo.descricao).toBe('Ingrediente de Teste');
    ingredienteId = ingredienteSalvo._id;
  });

  it('Deve alterar o ingrediente', async () => {
    const response = await request(app)
      .post('/ingredientes/edit')
      .send({
        id: ingredienteId,
        descricao: 'Ingrediente alterado'
      });

    // Verifica se o ingrediente foi altetado no banco de dados
    const ingredienteAlterado = await Ingrediente.findOne({ _id: ingredienteId });
    expect(ingredienteAlterado).toBeTruthy();
    expect(ingredienteAlterado.descricao).toBe('Ingrediente alterado');
  });

  it('Deve remover o ingrediente', async () => {
    const response = await request(app)
      .post('/ingredientes/deletar')
      .send({
        id: ingredienteId
      });

    // Verifica se o ingrediente foi removido do banco de dados
    const ingredienteRemovido = await Ingrediente.findOne({ _id: ingredienteId });
    expect(ingredienteRemovido).toBeFalsy();
  });  

});


describe('Testes finais para as rotas de grupos', () => {
  it('Deve alterar o grupo', async () => {
    const response = await request(app)
      .post('/grupos/edit')
      .send({
        id: grupoId,
        descricao: 'Grupo alterado',
        listarNoCardapio: 'ON'
      });

    // Verifica se o grupo foi altetado no banco de dados
    const grupoAlterado = await Grupo.findOne({ _id: grupoId });
    expect(grupoAlterado).toBeTruthy();
    expect(grupoAlterado.descricao).toBe('Grupo alterado');
  });

  it('Deve remover o grupo', async () => {
    const response = await request(app)
      .post('/grupos/deletar')
      .send({
        id: grupoId
      });

    // Verifica se o grupo foi removido do banco de dados
    const grupoRemovido = await Grupo.findOne({ _id: grupoId });
    expect(grupoRemovido).toBeFalsy();
  }); 
});
