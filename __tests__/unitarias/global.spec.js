const { enviarMensagemFlash, converterPreco } = require('../../utils/util');
const {validarProduto, validarGrupo} = require('../../middlewares/validationMiddleware');


// Teste para a função enviarMensagemFlash
test('Deve enviar mensagem flash', async () => {
    const req = { flash: jest.fn() };
    const tipo = 'success';
    const mensagem = 'Mensagem de teste';
    await enviarMensagemFlash(req, tipo, mensagem);
    expect(req.flash).toHaveBeenCalledWith(tipo, mensagem);
});

// Teste para verificar se a middleware valida a descrição corretamente
test('Deve validar a descrição do produto', () => {
    const req = { body: { descricao: '', erros: [] } };
    const res = {};
    const next = jest.fn();

    validarProduto(req, res, next);

    expect(req.erros).toContainEqual({ texto: "Descrição inválida" });
    expect(next).toHaveBeenCalled();
});

// Teste para a função converterPreco com separador virgula para decimal
test('Deve converter preço para formato aceito pelo MongoDB', () => {
    const precoString = '10,50';
    const precoConvertido = converterPreco(precoString);
    expect(precoConvertido).toBe('10.50');
});

// Teste para verificar se a middleware valida o grupo corretamente
test('Deve validar o grupo do produto', () => {
    const req = { body: { grupo: '0', erros: [] } };
    const res = {};
    const next = jest.fn();

    validarProduto(req, res, next);

    expect(req.erros).toContainEqual({ texto: "Selecione um grupo" });
    expect(next).toHaveBeenCalled();
});


