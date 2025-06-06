const container = document.querySelector('.container');
        const registerBtn = document.querySelector('.register-btn');
        const loginBtn = document.querySelector('.login-btn');

        registerBtn.addEventListener('click', () => {
            container.classList.add('active');
        })

        loginBtn.addEventListener('click', () => {
            container.classList.remove('active');
        })

        const apiUrl = 'http://localhost:3000/profissionais';

// Cadastro de profissional
document.querySelector('.register form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.register input[placeholder="nome de usuário"]').value;
    const email = document.querySelector('.register input[placeholder="Email"]').value;
    const password = document.querySelector('.register input[placeholder="senha"]').value;

    // Dados do modal (profissionais)
    const especialidade = document.querySelector('#modalprofissionais input[placeholder="Especialidade"]').value;
    const localizacao = document.querySelector('#modalprofissionais input[placeholder="Localização de atendimento"]').value;
    const horario = document.querySelector('#modalprofissionais input[placeholder="Horário de atendimento"]').value;
    const telefone = document.querySelector('#modalprofissionais input[placeholder="Telefone para contato"]').value;

    // Verifica se usuário já existe
    const res = await fetch(`${apiUrl}?username=${username}`);
    const existingUsers = await res.json();

    if (existingUsers.length > 0) {
        alert('Nome de usuário já está em uso.');
        return;
    }

    // Criação do novo usuário
    const novoProfissional = {
        username,
        email,
        password,
        especialidade,
        localizacao,
        horario,
        telefone
    };

    await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoProfissional)
    });

    alert('Cadastro realizado com sucesso!');
});

// Login
document.querySelector('.login form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.login input[placeholder="Nome de usuário"]').value;
    const password = document.querySelector('.login input[placeholder="senha"]').value;

    const res = await fetch(`${apiUrl}?username=${username}&password=${password}`);
    const users = await res.json();

    if (users.length > 0) {
        alert(`Login bem-sucedido. Bem-vindo, ${users[0].username}!`);
        // Redirecionar ou armazenar sessionStorage/localStorage se necessário
    } else {
        alert('Nome de usuário ou senha incorretos.');
    }
});

// Limitar o campo localizacao (endereço)
const localizacaoInput = document.getElementById('localizacao');
localizacaoInput.addEventListener('input', () => {
  if (localizacaoInput.value.length > 100) {
    localizacaoInput.value = localizacaoInput.value.slice(0, 100);
  }
});

// Máscara para telefone brasileiro (formato: (99) 99999-9999)
const telefoneInput = document.getElementById('telefone');

telefoneInput.addEventListener('input', function (e) {
  let x = e.target.value.replace(/\D/g, '').slice(0, 11); // Só números, máximo 11 dígitos (DDD + número)
  
  if (x.length > 10) { // Celular com 9 dígitos
    x = x.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (x.length > 5) { // Telefone fixo ou celular 8 dígitos
    x = x.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (x.length > 2) { // Apenas DDD e início do número
    x = x.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (x.length > 0) { // Apenas DDD incompleto
    x = x.replace(/^(\d{0,2})/, '($1');
  }

  e.target.value = x;
});
const emailInput = document.querySelector('input[type="email"]');

emailInput.addEventListener('input', (e) => {
  let val = e.target.value;

  // Permitir só letras, números, pontos, underscores antes do @gmail.com
  // E força o sufixo @gmail.com

  // Se já tiver @, só permite que seja @gmail.com
  if (val.includes('@')) {
    const parts = val.split('@');
    // Limita o usuário (parte antes do @) a 30 caracteres
    let userPart = parts[0].slice(0, 30);
    // Força o domínio para gmail.com
    val = userPart + '@gmail.com';
  } else {
    // Limita o que o usuário digita antes do @
    val = val.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
  }

  e.target.value = val;
});
