// Middleware de validação do produto
const validarProduto = (req, res, next) => {
    const erros = [];

    if (!req.body.descricao || typeof req.body.descricao === "undefined" || req.body.descricao === null) {
        erros.push({ texto: "Descrição inválida" });
    }
    if (req.body.descricao) {
        if (req.body.descricao.length < 2) {
            erros.push({ texto: "Descrição é muito pequena" });
        }
    }

    if (!req.body.grupo || req.body.grupo === '0') {
        erros.push({ texto: "Selecione um grupo" });
    }

    if (erros.length > 0) {
        req.erros = erros; // Adiciono os erros à requisição
        next(); // Continue com a próxima função de middleware (ou rota)
    } else {
        next();
    }
};

// Middleware de validação do grupo
const validarGrupo = (req, res, next) => {
    const erros = [];

    if (!req.body.descricao || typeof req.body.descricao === "undefined" || req.body.descricao === null) {
        erros.push({ texto: "Descrição inválida" });
    }
    if (req.body.descricao) {
        if (req.body.descricao.length < 2) {
            erros.push({ texto: "Descrição é muito pequena" });
        }
    }

    if (erros.length > 0) {
        req.erros = erros; // Adiciono os erros à requisição
        next(); // Continue com a próxima função de middleware (ou rota)
    } else {
        next();
    }
};

// Middleware de validação do ingrediente
const validarIngrediente = (req, res, next) => {
    const erros = [];

    if (!req.body.descricao || typeof req.body.descricao === "undefined" || req.body.descricao === null) {
        erros.push({ texto: "Descrição inválida" });
    }
    if (req.body.descricao) {
        if (req.body.descricao.length < 2) {
            erros.push({ texto: "Descrição é muito pequena" });
        }
    }

    if (erros.length > 0) {
        req.erros = erros; // Adiciono os erros à requisição
        next(); // Continue com a próxima função de middleware (ou rota)
    } else {
        next();
    }
};

module.exports = { validarProduto, validarGrupo, validarIngrediente };
