function getRegistrosFinanceiros() {
    const records = localStorage.getItem('registrosFinanceiros');
    return records ? JSON.parse(records) : [];
}

function saveRegistrosFinanceiros(records) {
    localStorage.setItem('registrosFinanceiros', JSON.stringify(records));
}

function deletarRegistro(index) {
    const allRecords = getRegistrosFinanceiros();
    const recordToDelete = allRecords[index];

    if (!recordToDelete) return; 

    const isConfirmed = window.confirm(`Tem certeza que deseja excluir o registro "${recordToDelete.descricao}"?`);

    if (isConfirmed) {
        allRecords.splice(index, 1);
        saveRegistrosFinanceiros(allRecords);
        aplicarFiltro(); 
    }
}


function calculaSaldo(date) {
    const records = getRegistrosFinanceiros();
    const targetDate = new Date(date);
    let saldoAnterior = 0;
    let totalCreditos = 0;
    let totalDebitos = 0;

    records.forEach(record => {
        const recordDate = new Date(record.data);
        if (recordDate < targetDate) {
            const valor = parseFloat(record.valor);
            if (record.tipo === 'credito') {
                totalCreditos += valor;
            } else if (record.tipo === 'debito') {
                totalDebitos += valor;
            }
        }
    });

    const saldoFinal = saldoAnterior + totalCreditos - totalDebitos;
    return saldoFinal;
}

function exibirRegistros(records, startDate = null, endDate = null) {
    const tbody = document.getElementById('registros-financeiros');
    tbody.innerHTML = '';

    let saldoAnterior = 0;
    let totalCreditos = 0;
    let totalDebitos = 0;

    saldoAnterior = calculaSaldo(new Date(startDate));

    records.forEach((record, index) => {
       
        const novaData = new Date(record.data);
        novaData.setDate(novaData.getDate() + 1)
        dataAux = novaData.toLocaleDateString('pt-BR', { timezone: 'UTC' })
        const row = document.createElement('tr');

       
        valorAux = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(record.valor)
        const valor = parseFloat(record.valor);
        if (record.tipo === 'credito') {
            totalCreditos += valor;
        } else if (record.tipo === 'debito') {
            totalDebitos += valor;
        }

        row.innerHTML = `
            <td>${record.descricao}</td>            
            <td>${dataAux}</td>
            <td>${valorAux}</td>
            <td>${record.tipo.charAt(0).toUpperCase() + record.tipo.slice(1)}</td>
            <td>
                <button class="btn-edit" onclick="editarRegistro(${index})">Editar</button>
                <button class="btn-delete" onclick="deletarRegistro(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    const saldoFinal = saldoAnterior + totalCreditos - totalDebitos;

    document.getElementById('saldo-anterior').innerText = `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoAnterior)}`;
    document.getElementById('total-creditos').innerText = `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCreditos)}`;
    document.getElementById('total-debitos').innerText = `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalDebitos)}`;
    document.getElementById('saldo-final').innerText = `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoFinal)}`;
}

function init() {
    const records = getRegistrosFinanceiros();
    exibirRegistros(records);
}

function editarRegistro(index) {
    window.location.href = `form.html?index=${index}`;
}

function aplicarFiltro() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const records = getRegistrosFinanceiros();

    const filteredRecords = records.filter(record => {
        const recordDate = new Date(record.data);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || recordDate >= start) && (!end || recordDate <= end);
    });

    exibirRegistros(filteredRecords, startDate, endDate);
}

window.onload = init;