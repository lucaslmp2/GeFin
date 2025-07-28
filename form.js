document.getElementById('form-financeiro').addEventListener('submit', function(event) {
    event.preventDefault();

    const index = document.getElementById('record-index').value;

    // Objeto com os dados do formulário
    const recordData = {
        descricao: document.getElementById('descricao').value,
        data: document.getElementById('data').value,
        valor: document.getElementById('valor').value,
        tipo: document.getElementById('tipo').value,
    };

    let records = localStorage.getItem('registrosFinanceiros');
    records = records ? JSON.parse(records) : [];

    if (index) { // Editando um registro existente
        // Mantém o ID original do registro que está sendo editado
        const originalId = records[parseInt(index)].id;
        records[parseInt(index)] = { ...recordData, id: originalId };
    } else { // Criando um novo registro
        // Adiciona um ID único ao novo registro
        recordData.id = Date.now().toString();
        records.push(recordData);
    }

    localStorage.setItem('registrosFinanceiros', JSON.stringify(records));

    window.location.href = 'table.html';
});

function carregarRegistroParaEditar() {
    const urlParams = new URLSearchParams(window.location.search);
    const index = urlParams.get('index');
    if (index !== null) {
        const records = JSON.parse(localStorage.getItem('registrosFinanceiros'));
        if (records && records[index]) {
            const record = records[index];
            document.getElementById('record-index').value = index;
            document.getElementById('descricao').value = record.descricao;
            document.getElementById('data').value = record.data;
            document.getElementById('valor').value = record.valor;
            document.getElementById('tipo').value = record.tipo;
            document.querySelector('.btn-primary').textContent = 'Atualizar Registro';
        }
    }
}

// Executar a função de inicialização ao carregar a página
window.onload = carregarRegistroParaEditar;