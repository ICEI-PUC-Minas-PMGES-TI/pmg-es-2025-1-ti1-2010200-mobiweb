document.addEventListener("DOMContentLoaded", () => {
  const btnSalvar = document.querySelector('#exampleModalToggle2 .btn-dark');
  const container = document.getElementById("avaliacoesContainer");

  function salvarAvaliacaoLocal(data) {
    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
    data.id = Date.now(); // ID único com base no timestamp
    avaliacoes.push(data);
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  }

  function excluirAvaliacao(id) {
  let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
  avaliacoes = avaliacoes.filter(av => String(av.id) !== String(id)); // <-- força comparação correta
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  renderAvaliacoes();
}


  function renderAvaliacoes() {
    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
    container.innerHTML = "";

    avaliacoes.forEach(avaliacao => {
      const card = document.createElement("div");
      card.classList.add("card", "mb-3");
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Nota: ${"⭐".repeat(avaliacao.nota)}</h5>
          <p class="card-text">Recomendação: ${avaliacao.recomendacao}</p>
          <p class="card-text">${avaliacao.comentario}</p>
          ${avaliacao.imagem ? `<img src="${avaliacao.imagem}" class="img-fluid rounded" width="150">` : ""}
          <br><br>
          <button class="btn btn-sm btn-danger" data-id="${avaliacao.id}">Excluir</button>
        </div>
      `;
      container.appendChild(card);
    });

    // Adiciona eventos aos botões de exclusão
    document.querySelectorAll(".btn-danger").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-id"));
        excluirAvaliacao(id);
      });
    });
  }

  btnSalvar.addEventListener("click", () => {
    const nota = document.getElementById("notaSelect").value;
    const recomendacao = document.getElementById("recomendacaoSelect").selectedOptions[0].text;
    const comentario = document.getElementById("floatingInput").value;
    const imagemInput = document.getElementById("formFileSingle");

    if (!nota || !recomendacao || !comentario) {
      alert("Preencha todos os campos antes de salvar.");
      return;
    }

    if (imagemInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64 = e.target.result;
        salvarAvaliacaoLocal({ nota, recomendacao, comentario, imagem: base64 });
        renderAvaliacoes();
      };
      reader.readAsDataURL(imagemInput.files[0]);
    } else {
      salvarAvaliacaoLocal({ nota, recomendacao, comentario, imagem: null });
      renderAvaliacoes();
    }
  });

  renderAvaliacoes();
});
