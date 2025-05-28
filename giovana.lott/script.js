function abrirModal(nome, especialidade, instagram, link, descricao, local, email, telefone, horario_atendimento, data_nascimento) {
  document.getElementById("modal-nome").textContent = nome;
  document.getElementById("modal-especialidade").textContent = especialidade;
  document.getElementById("modal-instagram").textContent = instagram;
  document.getElementById("modal-instagram").href = link;
  document.getElementById("modal-descricao").textContent = descricao;
  document.getElementById("modal-local").textContent = local;
  document.getElementById("modal-email").textContent = email;
  document.getElementById("modal-telefone").textContent = telefone;
  document.getElementById("modal-horario-atendimento").textContent = horario_atendimento;
  document.getElementById("modal-data-nascimento").textContent = data_nascimento;
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

window.onclick = function (event) {
  if (event.target === document.getElementById("modal")) {
    fecharModal();
  }
};

function filtrarCards() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.getElementsByClassName("card");

  for (let i = 0; i < cards.length; i++) {
    const nome = cards[i].querySelector("h3").textContent.toLowerCase();
    const especialidade = cards[i].querySelector("p")?.textContent.toLowerCase() || "";

    if (nome.includes(input) || especialidade.includes(input)) {
      cards[i].style.display = "block";
    } else {
      cards[i].style.display = "none";
    }
  }
}
