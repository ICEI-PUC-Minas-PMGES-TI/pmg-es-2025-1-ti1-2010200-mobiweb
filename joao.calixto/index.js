document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('formTitle');
    const btnSalvar = document.getElementById('btnSalvar');
    const listaPontos = document.getElementById('listaPontos');
    const editandoId = localStorage.getItem('editandoId');

    if (formTitle) {
        formTitle.textContent = editandoId ? 'Editar Local Acessível' : 'Informações do Local Acessível';
    }

    if (editandoId && document.getElementById('nomeLocal')) {
        fetch(`http://localhost:3000/pontosAcessiveis/${editandoId}`)
            .then(res => res.json())
            .then(ponto => {
                document.getElementById('nomeLocal').value = ponto.nomeLocal;
                document.getElementById('bairro').value = ponto.bairro;
                document.getElementById('rua').value = ponto.rua;
                document.getElementById('numero').value = ponto.numero;
                document.getElementById('referencia').value = ponto.referencia || '';
                document.getElementById('tipoAcessibilidade').value = ponto.tipoAcessibilidade || '';
                document.getElementById('descricaoAdicional').value = ponto.descricaoAdicional || '';
            })
            .catch(error => console.error("Erro ao carregar para edição:", error));
    }

    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => {
            e.preventDefault();
            const nomeLocal = document.getElementById('nomeLocal').value.trim();
            const bairro = document.getElementById('bairro').value.trim();
            const rua = document.getElementById('rua').value.trim();
            const numero = document.getElementById('numero').value.trim();
            if (!nomeLocal || !bairro || !rua || !numero) {
                alert('Por favor, preencha os campos obrigatórios.');
                return;
            }
            const ponto = { nomeLocal, bairro, rua, numero, referencia: document.getElementById('referencia').value.trim(), tipoAcessibilidade: document.getElementById('tipoAcessibilidade').value.trim(), descricaoAdicional: document.getElementById('descricaoAdicional').value.trim() };
            const url = editandoId ? `http://localhost:3000/pontosAcessiveis/${editandoId}` : 'http://localhost:3000/pontosAcessiveis';
            const method = editandoId ? 'PUT' : 'POST';
            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ponto)
            })
            .then(res => res.json())
            .then(() => {
                localStorage.removeItem('editandoId');
                window.location.href = 'teste.html';
            })
            .catch(error => console.error("Erro ao salvar/editar:", error));
        });
    }

    if (listaPontos) {
        fetch('http://localhost:3000/pontosAcessiveis')
            .then(res => res.json())
            .then(pontos => {
                listaPontos.innerHTML = '';
                pontos.forEach(ponto => {
                    const card = document.createElement('div');
                    card.className = 'col-12 col-md-6';
                    card.innerHTML = `
                        <div class="card shadow-sm p-3" data-id="${ponto.id}">
                            <h5>${ponto.nomeLocal}</h5>
                            <p><strong>Bairro:</strong> ${ponto.bairro}</p>
                            <p><strong>Rua:</strong> ${ponto.rua}, ${ponto.numero}</p>
                            <p><strong>Referência:</strong> ${ponto.referencia || 'Nenhuma'}</p>
                            <p><strong>Tipo de Acessibilidade:</strong> ${ponto.tipoAcessibilidade || 'Não informado'}</p>
                            <p><strong>Descrição Adicional:</strong> ${ponto.descricaoAdicional || 'Nenhuma'}</p>
                            <div class="d-flex justify-content-end gap-2">
                                <button class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
                                <button class="btn btn-sm btn-outline-danger btn-excluir">Excluir</button>
                            </div>
                        </div>
                    `;
                    listaPontos.appendChild(card);
                });

                // Adicionar event listeners APÓS os botões serem criados
                document.querySelectorAll('.btn-editar').forEach(botao => {
                    botao.addEventListener('click', function() {
                        const cardElement = this.closest('.card');
                        const id = cardElement.dataset.id;
                        editarPonto(id);
                    });
                });

                document.querySelectorAll('.btn-excluir').forEach(botao => {
                    botao.addEventListener('click', function() {
                        const cardElement = this.closest('.card');
                        const id = cardElement.dataset.id;
                        excluirPonto(id);
                    });
                });
            })
            .catch(error => console.error("Erro ao carregar pontos:", error));
    }
});

function editarPonto(id) {
    localStorage.setItem('editandoId', id);
    window.location.href = 'formulario.html';
}

function excluirPonto(id) {
    if (confirm('Tem certeza que deseja excluir este ponto?')) {
        fetch(`http://localhost:3000/pontosAcessiveis/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => location.reload())
        .catch(error => console.error("Erro ao excluir:", error));
    }
}