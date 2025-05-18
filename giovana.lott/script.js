// script.js

// Função para abrir o modal com os dados
function abrirModal(profissional) {
  document.getElementById("modal-nome").textContent = profissional.nome;
  document.getElementById("modal-especialidade").textContent = profissional.especialidade;
  document.getElementById("modal-email").textContent = profissional.email;
  document.getElementById("modal-telefone").textContent = profissional.telefone;
  document.getElementById("modal-horario").textContent = profissional.horario;
  document.getElementById("modal-nascimento").textContent = profissional.nascimento;
  document.getElementById("modal-endereco").textContent = profissional.endereco;
  document.getElementById("modal-descricao").textContent = profissional.descricao;
  document.getElementById("modal-instagram").textContent = profissional.instagram;
  document.getElementById("modal-instagram").href = profissional.linkInstagram;

  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Fecha o modal ao clicar fora dele
window.onclick = function(event) {
  if (event.target === document.getElementById("modal")) {
    fecharModal();
  }
};

// Carregar os dados do JSON
fetch('dados.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('cards-container');
    data.forEach(profissional => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${profissional.foto}" alt="Foto de ${profissional.nome}" />
        <h3>${profissional.nome}</h3>
        <p><strong>Especialidade:</strong> ${profissional.especialidade}</p>
        <p><strong>Instagram:</strong> <a href="${profissional.linkInstagram}" target="_blank">${profissional.instagram}</a></p>
      `;
      card.onclick = () => abrirModal(profissional);
      container.appendChild(card);
    });
  })
  .catch(error => console.error('Erro ao carregar os dados:', error));
