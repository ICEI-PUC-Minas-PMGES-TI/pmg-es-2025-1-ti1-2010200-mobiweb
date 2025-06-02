document.addEventListener("DOMContentLoaded", () => {
  const tipoRadios = document.querySelectorAll('input[name="tipo"]');
  const campoEspecialidade = document.getElementById("campoEspecialidade");
  const camposProfissional = document.getElementById("camposProfissional");
  const formCadastro = document.getElementById("formCadastro");
  const formLogin = document.getElementById("formLogin");
  const mensagemCadastro = document.getElementById("mensagemCadastro");
  const mensagemLogin = document.getElementById("mensagemLogin");
  const telefoneInput = document.getElementById("telefone");

  // Aplica máscara no telefone e bloqueia caracteres não numéricos
  telefoneInput.addEventListener("input", () => {
    let numeros = telefoneInput.value.replace(/\D/g, "").slice(0, 11); // Limita a 11 dígitos
    let formatado = "";

    if (numeros.length <= 2) {
      formatado = `(${numeros}`;
    } else if (numeros.length <= 6) {
      formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    } else if (numeros.length <= 10) {
      formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
    } else {
      formatado = `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
    }

    telefoneInput.value = formatado;
  });

  tipoRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      const mostrar = radio.value === "profissional";
      campoEspecialidade.style.display = mostrar ? "block" : "none";
      camposProfissional.style.display = mostrar ? "block" : "none";
    });
  });

  formCadastro.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const especialidade = document.getElementById("especialidade").value;

    const instagram = document.getElementById("instagram").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const localAtendimento = document.getElementById("localAtendimento").value.trim();
    const telefone = telefoneInput.value.trim();
    const horarioAtendimento = document.getElementById("horarioAtendimento").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;

    if (tipo === "profissional" && especialidade === "") {
      mensagemCadastro.style.color = "red";
      mensagemCadastro.textContent = "Por favor, selecione uma especialidade.";
      return;
    }

    const usuariosExistentes = JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailJaExiste = usuariosExistentes.some(usuario => usuario.email === email);
    if (emailJaExiste) {
      mensagemCadastro.style.color = "red";
      mensagemCadastro.textContent = "Este e-mail já está cadastrado.";
      return;
    }

    const novoUsuario = {
      tipo,
      nome,
      email,
      senha,
      especialidade: tipo === "profissional" ? especialidade : null,
      instagram: tipo === "profissional" ? instagram : null,
      descricao: tipo === "profissional" ? descricao : null,
      localAtendimento: tipo === "profissional" ? localAtendimento : null,
      telefone: tipo === "profissional" ? telefone : null,
      horarioAtendimento: tipo === "profissional" ? horarioAtendimento : null,
      dataNascimento: tipo === "profissional" ? dataNascimento : null
    };

    usuariosExistentes.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosExistentes));

    mensagemCadastro.style.color = "green";
    mensagemCadastro.textContent = "Cadastro realizado com sucesso!";

    formCadastro.reset();
    campoEspecialidade.style.display = "none";
    camposProfissional.style.display = "none";
  });

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuario = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuario) {
      mensagemLogin.style.color = "green";
      mensagemLogin.textContent = "Login bem-sucedido!";
      setTimeout(() => {
        window.location.href = "pagina-principal.html"; // sua página de destino
      }, 1000);
    } else {
      mensagemLogin.style.color = "red";
      mensagemLogin.textContent = "E-mail ou senha incorretos.";
    }
  });
});

function mostrarLogin() {
  document.getElementById("boxLogin").style.display = "block";
  document.getElementById("boxCadastro").style.display = "none";
}

function mostrarCadastro() {
  document.getElementById("boxLogin").style.display = "none";
  document.getElementById("boxCadastro").style.display = "block";
}
