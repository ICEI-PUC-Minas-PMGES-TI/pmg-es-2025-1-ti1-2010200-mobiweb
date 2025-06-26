async function carregarFavoritos() {
  const container = document.getElementById('favoritosContainer');
  container.innerHTML = '';

  try {
    const res = await fetch('http://localhost:3000/locais');
    const dados = await res.json();

    const favoritos = dados.filter(local => local.favorito === true);

    if (favoritos.length === 0) {
      container.innerHTML = '<p>Nenhum local favoritado encontrado.</p>';
      return;
    }

    favoritos.forEach(local => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';

      col.innerHTML = `
        <div class="member-block">
          <div class="member-block-image-wrap">
            <img src="${local.imagem || '../guilherme/images/default-user.png'}" class="member-block-image img-fluid" alt="${local.nomeLocal}">
            <ul class="social-icon">
              <li>${local.rua}, ${local.numero}</li>
              <li>${local.bairro}</li>
              <li>${local.referencia}</li>
            </ul>
          </div>
          <div class="member-block-info d-flex align-items-center">
            <h4>${local.nomeLocal}</h4>
            <p class="ms-auto">${'⭐'.repeat(Number(local.nota))}</p>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  } catch (err) {
    container.innerHTML = '<p>Erro ao carregar dados.</p>';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', carregarFavoritos);
