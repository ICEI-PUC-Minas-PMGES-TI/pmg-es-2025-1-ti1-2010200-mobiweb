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
