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
  limparFormulario();
  carregarAvaliacoes();
});

function limparFormulario() {
  document.getElementById('nomeLocal').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('rua').value = '';
  document.getElementById('numero').value = '';
  document.getElementById('referencia').value = '';
  document.getElementById('notaSelect').value = '';
  document.getElementById('recomendacaoSelect').value = '';
  document.getElementById('comentario').value = '';
  imagemBase64 = "";
  preview.src = "";
}

async function carregarAvaliacoes() {
  const todosContainer = document.getElementById('todosContainer');
  const favoritosContainer = document.getElementById('favoritosContainer');

  todosContainer.innerHTML = '';
  favoritosContainer.innerHTML = '';

  const res = await fetch('http://localhost:3000/locais');
  const dados = await res.json();

  dados.forEach(local => {
    const cardTodos = criarCard(local);
    todosContainer.appendChild(cardTodos);

    if(local.favorito) {
      const cardFav = criarCard(local);
      favoritosContainer.appendChild(cardFav);
    }
  });
}

function criarCard(local) {
  const col = document.createElement('div');
  col.className = 'col-md-4 mb-4';

  const card = document.createElement('div');
  card.className = 'member-block';

  // Conteúdo da imagem e infos do local
  card.innerHTML = `
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
    </div>
  `;

  // Botão favoritar
  const btnFavorito = document.createElement('button');
  btnFavorito.className = 'btn btn-sm ' + (local.favorito ? 'btn-warning' : 'btn-outline-warning');
  btnFavorito.innerHTML = `<ion-icon name="${local.favorito ? 'star' : 'star-outline'}"></ion-icon> ${local.favorito ? 'Favoritado' : 'Favorito'}`;

  btnFavorito.addEventListener('click', () => toggleFavorito(local.id));

  // Adiciona o botão no container .member-block-info
  card.querySelector('.member-block-info').appendChild(btnFavorito);

  col.appendChild(card);
  return col;
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

async function toggleFavorito(id) {
  // Busca o local atual
  const res = await fetch(`http://localhost:3000/locais/${id}`);
  const local = await res.json();
  const novoValor = !local.favorito;

  // Atualiza favorito no backend
  await fetch(`http://localhost:3000/locais/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorito: novoValor })
  });

  // Recarrega cards para atualizar visual
  carregarAvaliacoes();
}

function exibirAba(aba) {
  document.getElementById('todosContainer').classList.toggle('d-none', aba !== 'todos');
  document.getElementById('favoritosContainer').classList.toggle('d-none', aba !== 'favoritos');

  document.getElementById('tabTodos').classList.toggle('active', aba === 'todos');
  document.getElementById('tabFav').classList.toggle('active', aba === 'favoritos');
}

document.addEventListener('DOMContentLoaded', carregarAvaliacoes);
