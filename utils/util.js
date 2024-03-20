// Função para enviar mensagem flash
async function enviarMensagemFlash(req, tipo, mensagem) {
    req.flash(tipo, mensagem);
}

//função para converter preço para formato aceito mongodb
function converterPreco(precoString) {
    const precoLimpo = precoString.replace(/[^\d,.]/g, '');
    const precoFormatado = precoLimpo.replace(',', '.');
    return precoFormatado;
}

// Exportar a função para que ela possa ser usada em outros arquivos
module.exports = {
    enviarMensagemFlash,
    converterPreco
}