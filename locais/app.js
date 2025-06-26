const inputImagem = document.getElementById('formFileSingle');
const preview = document.getElementById('preview');
let imagemBase64 = "";

inputImagem.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagemBase64 = e.target.result;
      preview.src = imagemBase64;
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('btnSalvar').addEventListener('click', async () => {
  const local = {
    nomeLocal: document.getElementById('nomeLocal').value,
    bairro: document.getElementById('bairro').value,
    rua: document.getElementById('rua').value,
    numero: document.getElementById('numero').value,
    referencia: document.getElementById('referencia').value,
    nota: document.getElementById('notaSelect').value,
    recomendacao: document.getElementById('recomendacaoSelect').value,
    comentario: document.getElementById('comentario').value,
    imagem: imagemBase64,
    favorito: false
  };

  await fetch('http://localhost:3000/locais', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(local)
  });

  bootstrap.Modal.getInstance(document.getElementById('modalForm')).hide();
  carregarAvaliacoes();
});

async function carregarAvaliacoes() {
  const container = document.getElementById('avaliacoesContainer');
  container.innerHTML = '';

  const res = await fetch('http://localhost:3000/locais');
  const dados = await res.json();

  dados.forEach((local) => {
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-4';

    col.innerHTML = `
      <div class="member-block">
        <div class="member-block-image-wrap">
          <img src="${local.imagem || 'https://via.placeholder.com/300'}" class="member-block-image img-fluid" alt="Imagem">
          <ul class="social-icon">
            <li>Rua: ${local.rua}, ${local.numero}</li>
            <li>Bairro: ${local.bairro}</li>
            <li>Referência: ${local.referencia}</li>
          </ul>
        </div>
        <div class="member-block-info d-flex align-items-center justify-content-between">
          <div>
            <h4>${local.nomeLocal}</h4>
            <p>${'⭐'.repeat(Number(local.nota))} - ${getRecomendacao(local.recomendacao)}</p>
          </div>
          <button class="btn btn-sm ${local.favorito ? 'btn-warning' : 'btn-outline-warning'}"
                  onclick="toggleFavorito(${local.id}, this)">
            <ion-icon name="${local.favorito ? 'star' : 'star-outline'}"></ion-icon> 
            ${local.favorito ? 'Favoritado' : 'Favorito'}
          </button>
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

function getRecomendacao(valor) {
  switch (valor) {
    case '1': return 'Recomendo muito';
    case '2': return 'Recomendo';
    case '3': return 'Recomendo pouco';
    case '4': return 'Não recomendo';
    default: return '';
  }
}

async function toggleFavorito(id, botao) {
  const res = await fetch(`http://localhost:3000/locais/${id}`);
  const local = await res.json();
  const novoValor = !local.favorito;

  await fetch(`http://localhost:3000/locais/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorito: novoValor })
  });

  // Atualização visual imediata
  if (novoValor) {
    botao.innerHTML = `<ion-icon name="star"></ion-icon> Favoritado`;
    botao.classList.remove('btn-outline-warning');
    botao.classList.add('btn-warning');
  } else {
    botao.innerHTML = `<ion-icon name="star-outline"></ion-icon> Favorito`;
    botao.classList.remove('btn-warning');
    botao.classList.add('btn-outline-warning');
  }
}

document.addEventListener('DOMContentLoaded', carregarAvaliacoes);
