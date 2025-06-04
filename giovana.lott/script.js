function abrirModal(nome, especialidade, instagram, linkInstagram, descricao, local, email, telefone, horario, nascimento) {
  document.getElementById("modal-nome").textContent = nome;
  document.getElementById("modal-especialidade").textContent = especialidade;
  document.getElementById("modal-instagram").textContent = instagram;
  document.getElementById("modal-insta-link").href = linkInstagram;
  document.getElementById("modal-descricao").textContent = descricao;
  document.getElementById("modal-local").textContent = local;
  document.getElementById("modal-email").textContent = email;
  document.getElementById("modal-telefone").textContent = telefone;
  document.getElementById("modal-horario").textContent = horario;
  document.getElementById("modal-nascimento").textContent = nascimento;

  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}
