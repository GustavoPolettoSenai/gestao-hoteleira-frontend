// Script relacionado ao módulo de clientes

// Array principal armazenado no navegador
if (localStorage.getItem('listaclientes') == null) {
    listaclientes = [];
    localStorage.setItem('listaclientes', JSON.stringify(listaclientes));
} else {
    listaclientes = JSON.parse(localStorage.getItem('listaclientes'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function () {

    // Chamadas
    listar();

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function () {
        // Pega os dados dos campos do formulário
        let id = document.querySelector('#campo-id').value;
        let nomeCompleto = document.querySelector('#campo-nome-completo').value;
        let dataNascimento = document.querySelector('#campo-data-nascimento').value;
        let documento = document.querySelector('#campo-documento').value;
        let pais = document.querySelector('#campo-pais').value;
        let estado = document.querySelector('#campo-estado').value;
        let cidade = document.querySelector('#campo-cidade').value;
        let fidelidade = document.querySelector('#campo-fidelidade').checked;
        let observacao = document.querySelector('#campo-obs').value;

        // Validações de campos
        if (nomeCompleto == "") {
            alert("Nome completo é um campo obrigatório!");
            return;
        } else if (dataNascimento == "") {
            alert("Data de nascimento é um campo obrigatório!");
            return;
        } else if (documento == "") {
            alert("Documento é um campo obrigatório!");
            return;
        }

        // Cria objeto
        let cliente = {
            id: (id != "") ? id : getMaiorIdLista() + 1,
            nomeCompleto: nomeCompleto,
            dataNascimento: formatarDataParaBR(dataNascimento),
            documento: documento,
            pais: pais,
            estado: estado,
            cidade: cidade,
            fidelidade: fidelidade,
            observacao: observacao
        };

        // Altera ou insere uma posição no array principal
        if (id != "") {
            let indice = getIndiceListaPorId(id);
            listaclientes[indice] = cliente;
        } else {
            listaclientes.push(cliente);
        }

        // Armazena a lista atualizada no navegador
        localStorage.setItem('listaclientes', JSON.stringify(listaclientes));

        // Reseta o formulário e recarrega a tabela de listagem
        this.blur();
        resetarForm();

        // Recarrega listagem
        carregar("Salvo com sucesso!");
        listar();
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function () {
        resetarForm();
    });

});

// Funções

function listar() {
    document.querySelector('table tbody').innerHTML = "";
    document.querySelector('#total-registros').textContent = listaclientes.length;
    listaclientes.forEach(function (objeto) {
        // Cria string html com os dados da lista
        let htmlAcoes = "";
        htmlAcoes += '<button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>';
        htmlAcoes += '<button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>';

        let tr = `
            <tr>
                <td>${objeto.id}</td>
                <td>${objeto.nomeCompleto}</td>
                <td>${objeto.dataNascimento}</td>
                <td>${objeto.documento}</td>
                <td>${objeto.pais}</td>
                <td>${objeto.estado}</td>
                <td>${objeto.cidade}</td>
                <td>${objeto.fidelidade ? "Sim" : "Não"}</td>
                <td style= "width: 1000px;
    word-break: break-all;">${objeto.observacao}</td>
                <td>${htmlAcoes}</td>
            </tr>
        `;
        document.querySelector('table tbody').innerHTML += tr;
    });

    // Vincula eventos de clique para os botões "Editar" e "Excluir"
    document.querySelectorAll('.bt-editar').forEach(function (botao, index) {
        botao.addEventListener('click', function () {
            editar(listaclientes[index]);
        });
    });

    document.querySelectorAll('.bt-excluir').forEach(function (botao, index) {
        botao.addEventListener('click', function () {
            excluir(listaclientes[index].id);
        });
    });
}

function editar(cliente) {
    document.querySelector('#campo-id').value = cliente.id;
    document.querySelector('#campo-nome-completo').value = cliente.nomeCompleto;
    document.querySelector('#campo-data-nascimento').value = formatarDataParaEN(cliente.dataNascimento);
    document.querySelector('#campo-documento').value = cliente.documento;
    document.querySelector('#campo-pais').value = cliente.pais;
    document.querySelector('#campo-estado').value = cliente.estado;
    document.querySelector('#campo-cidade').value = cliente.cidade;
    document.querySelector('#campo-fidelidade').checked = cliente.fidelidade;
    document.querySelector('#campo-obs').value = cliente.observacao;
}

function excluir(id) {
    if (confirm("Deseja realmente excluir este cliente?")) {
        let indice = getIndiceListaPorId(id);
        listaclientes.splice(indice, 1);
        localStorage.setItem('listaclientes', JSON.stringify(listaclientes));
        carregar("Excluído com sucesso!");
        listar();
    }
}

function resetarForm() {
    document.querySelector('#campo-id').value = "";
    document.querySelector('#campo-nome-completo').value = "";
    document.querySelector('#campo-data-nascimento').value = "";
    document.querySelector('#campo-documento').value = "";
    document.querySelector('#campo-pais').value = "";
    document.querySelector('#campo-estado').value = "";
    document.querySelector('#campo-cidade').value = "";
    document.querySelector('#campo-fidelidade').checked = false;
    document.querySelector('#campo-obs').value = "";
}

function getIndiceListaPorId(id) {
    return listaclientes.findIndex(cliente => cliente.id == id);
}

function getMaiorIdLista() {
    return listaclientes.length > 0 ? Math.max(...listaclientes.map(cliente => cliente.id)) : 0;
}

function carregar(mensagem) {
    alert(mensagem);
}

function formatarDataParaBR(dataEN) {
    let data = new Date(dataEN);
    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function formatarDataParaEN(dataBR) {
    let partes = dataBR.split('/');
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}