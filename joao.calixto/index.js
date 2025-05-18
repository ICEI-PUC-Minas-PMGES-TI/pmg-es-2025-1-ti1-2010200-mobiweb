document.addEventListener('DOMContentLoaded', function () {
  const btnSalvar = document.getElementById('btnSalvar');
  const idEditando = localStorage.getItem('editandoId');

  const titulo = document.querySelector('h4.mb-3.text-center');
  if (titulo) {
    if (idEditando) {
      titulo.textContent = 'Editar Local Acessível';
    } else {
      titulo.textContent = 'Informações do Local Acessível';
    }
  }

  if (btnSalvar) {
    btnSalvar.addEventListener('click', function (e) {
      e.preventDefault(); 

      const nomeLocal = document.getElementById('nomeLocal').value.trim();
      const bairro = document.getElementById('bairro').value.trim();
      const rua = document.getElementById('rua').value.trim();
      const numero = document.getElementById('numero').value.trim();
      const referencia = document.getElementById('referencia').value.trim();
      const tipoAcessibilidade = document.getElementById('tipoAcessibilidade').value.trim();
      const descricaoAdicional = document.getElementById('descricaoAdicional').value.trim();

      
      if (!nomeLocal || !bairro || !rua || !numero) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const ponto = { nomeLocal, bairro, rua, numero, referencia, tipoAcessibilidade, descricaoAdicional };

      if (idEditando) {
        fetch(`http://localhost:3000/pontosAcessiveis/${idEditando}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ponto)
        })
        .then(() => {
          localStorage.removeItem('editandoId');
          window.location.href = 'teste.html';
        })
        .catch(() => alert('Erro ao editar ponto.'));
      } else {
        fetch('http://localhost:3000/pontosAcessiveis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ponto)
        })
        .then(() => window.location.href = 'teste.html')
        .catch(() => alert('Erro ao salvar ponto.'));
      }
    });
  }

  
  if (idEditando && document.getElementById('nomeLocal')) {
    fetch(`http://localhost:3000/pontosAcessiveis/${idEditando}`)
      .then(res => res.json())
      .then(ponto => {
        document.getElementById('nomeLocal').value = ponto.nomeLocal;
        document.getElementById('bairro').value = ponto.bairro;
        document.getElementById('rua').value = ponto.rua;
        document.getElementById('numero').value = ponto.numero;
        document.getElementById('referencia').value = ponto.referencia || '';
        document.getElementById('tipoAcessibilidade').value = ponto.tipoAcessibilidade || '';
        document.getElementById('descricaoAdicional').value = ponto.descricaoAdicional || '';
      });
  }

  
  const lista = document.getElementById('listaPontos');

  if (lista) {
    fetch('http://localhost:3000/pontosAcessiveis')
      .then(res => res.json())
      .then(pontos => {
        lista.innerHTML = ''; 

        pontos.forEach((ponto) => {
          const card = document.createElement('div');
          card.className = 'col-12 col-md-6';

          card.innerHTML = `
            <div class="card shadow-sm p-3">
              <h5>${ponto.nomeLocal}</h5>
              <p><strong>Bairro:</strong> ${ponto.bairro}</p>
              <p><strong>Rua:</strong> ${ponto.rua}, ${ponto.numero}</p>
              <p><strong>Referência:</strong> ${ponto.referencia || 'Nenhuma'}</p>
              <p><strong>Tipo de Acessibilidade:</strong> ${ponto.tipoAcessibilidade || 'Não informado'}</p>
              <p><strong>Descrição Adicional:</strong> ${ponto.descricaoAdicional || 'Nenhuma'}</p>
              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-sm btn-outline-primary" onclick="editarPonto(${ponto.id})">Editar</button>
                <button class="btn btn-sm btn-outline-danger" onclick="excluirPonto(${ponto.id})">Excluir</button>
              </div>
            </div>
          `;

          lista.appendChild(card);
        });
      });
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
    .then(() => location.reload())
    .catch(() => alert('Erro ao excluir ponto.'));
  }
}