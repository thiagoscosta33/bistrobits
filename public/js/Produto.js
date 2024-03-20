function enviarFotoParaServidor(file) {
    const formData = new FormData();
    formData.append('foto', file);

    fetch('/produtos/fotos/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            const nomeArquivoServidor = data.nomeArquivo;
            totalFotos++
            adicionarFotoNaLista(file, nomeArquivoServidor);
        })
        .catch(error => {
            console.error('Erro ao enviar foto:', error);
        });
}

function removeFotoDoArrayEAtualizarCampo(nomeArquivoServidor) {
    const element = document.getElementById('nomeDasImagens');
    if (element) {
        const index = nomesImagens.indexOf(nomeArquivoServidor);
        if (index !== -1) {
            nomesImagens.splice(index, 1);
            element.value = JSON.stringify(nomesImagens);
        }
    } else {
        console.error('Elemento com ID "nomeDasImagens" não encontrado.');
    }
}

function obterIdDoProduto() {
    const idProdutoElement = document.getElementById('idProduto');
    if (idProdutoElement) {
        return idProdutoElement.value;
    } else {
        console.error('Elemento com id "id" não encontrado.');
        return null;
    }
}

function removerFotoDoProduto(idProduto, nomeArquivo) {
    return fetch(`/produtos/produtos/${idProduto}/fotos/${nomeArquivo}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao remover a foto: ' + response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao remover a foto:', error);
        });
}

function removerFoto(event) {
    const fotoRemovida = event.target.parentNode;
    const fotoMiniatura = fotoRemovida.querySelector('.foto-miniatura');
    const nomeArquivoServidor = fotoMiniatura.dataset.nomeArquivo;
    const idProduto = obterIdDoProduto();

    fetch(`/produtos/remover/file/${nomeArquivoServidor}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                if (idProduto && idProduto.trim() !== '') {
                    removerFotoDoProduto(idProduto, nomeArquivoServidor)
                        .then(() => {
                            removeFotoDoArrayEAtualizarCampo(nomeArquivoServidor);
                            fotoRemovida.remove();
                            totalFotos--;
                        })
                        .catch(error => {
                            console.error('Erro ao remover foto do produto:', error);
                        });
                } else {
                    removeFotoDoArrayEAtualizarCampo(nomeArquivoServidor);
                    fotoRemovida.remove();
                    totalFotos--;
                }
            } else {
                console.error('Erro ao excluir foto do servidor:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erro ao excluir foto:', error);
        });
}



function adicionarFotoNaLista(file, nomeArquivoServidor) {
    const fotoURL = URL.createObjectURL(file);
    const listaFotos = document.getElementById('lista-fotos');

    // Cria um container para a miniatura da foto e o ícone de remover
    const container = document.createElement('div');
    container.classList.add('foto-container');

    // Cria a miniatura da foto
    const miniatura = document.createElement('img');
    miniatura.src = fotoURL;
    miniatura.classList.add('foto-miniatura');

    //Adiciona o nome do arquivo do servidor como um atributo de dados na miniatura
    miniatura.dataset.nomeArquivo = nomeArquivoServidor;

    container.appendChild(miniatura);

    // Cria o ícone de remover
    const iconeRemover = document.createElement('i');
    iconeRemover.classList.add('fas', 'fa-trash-alt', 'remover-foto');
    iconeRemover.setAttribute('aria-hidden', 'true');
    iconeRemover.addEventListener('click', removerFoto);
    container.appendChild(iconeRemover);

    // adiciono o nome das imagens no array 
    nomesImagens.push(nomeArquivoServidor);
    document.getElementById('nomeDasImagens').value = JSON.stringify(nomesImagens);

    // Adiciona o container à lista de fotos
    listaFotos.appendChild(container);
}

document.getElementById('fotos').addEventListener('change', function (event) {
    const files = event.target.files;
    if (totalFotos + files.length > limiteTotalFotos) {
        alert(`Você só pode adicionar no máximo ${limiteTotalFotos} fotos.`);
        event.target.value = '';
        return;
    }
    for (let i = 0; i < files.length; i++) {
        enviarFotoParaServidor(files[i]);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var precoInput = document.getElementById('preco');
    VMasker(precoInput).maskMoney({ precision: 2, separator: ',', delimiter: '.', unit: '' });
});

document.addEventListener("DOMContentLoaded", function (event) {
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('ingr-selected')) {
            var idIngrediente = event.target.getAttribute('data-ingrediente-id');
            adicionarIngredienteAlista(idIngrediente);
        }
    });
});

document.addEventListener("DOMContentLoaded", function (event) {
    $(function () {
        $(document).on('submit', '#formularioProduto', function (event) {
            event.preventDefault();

            let ingredientesSelecionados = [];
            $('#listaIngredientesdoProduto li').each(function () {
                ingredientesSelecionados.push($(this).attr('data-ingrediente-id'));
            });

            $('#ingredientes').val(JSON.stringify(ingredientesSelecionados));

            this.submit();
        });


        $(document).on('click', '.ingr-into-list', function () {
            const liPai = $(this).closest('li');
            liPai.remove();
        });

    });
});


function adicionarIngredienteAlista(idIngrediente) {
    fetch(`/ingredientes/obter_ingredientes/${idIngrediente}`, {
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                console.error('Erro ao obter os detalhes do ingrediente:', response.statusText);
            } else {
                let listaIngredientes = $('#listaIngredientesdoProduto');
                response.json().then(novoIngrediente => {
                    let li = $('<li class="list-group-item d-flex justify-content-between align-items-center"></li>');
                    li.attr('data-ingrediente-id', novoIngrediente._id);
                    li.text(novoIngrediente.descricao);
                    let botao = $('<button type="button" class="btn btn-danger ingr-into-list">Remover</button>');
                    botao.attr('data-ingrediente-id', novoIngrediente._id);
                    li.append(botao);
                    listaIngredientes.append(li);
                    $('#consultaIngredientesModal').modal('hide');
                });
            }
        })
        .catch(error => {
            console.error('Erro ao obter os detalhes do ingrediente:', error);
        });
}

