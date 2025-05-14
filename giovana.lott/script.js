function abrirModal(nome, especialidade, instagram, link, descricao) {
    document.getElementById("modal-nome").textContent = nome;
    document.getElementById("modal-especialidade").textContent = especialidade;

    const instaLink = document.getElementById("modal-instagram");
    instaLink.textContent = instagram;
    instaLink.href = link;

    document.getElementById("modal-descricao").textContent = descricao;
    document.getElementById("modal").style.display = "flex";
}

function fecharModal(event) {
    const modal = document.getElementById("modal");

    // Fecha se clicar fora da janela ou no X
    if (event.target === modal || event.target.classList.contains("close")) {
        modal.style.display = "none";
    }
}
