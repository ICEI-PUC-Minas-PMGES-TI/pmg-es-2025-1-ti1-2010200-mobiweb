const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn?.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn?.addEventListener('click', () => {
    container.classList.remove('active');
});

const apiUrl = 'http://localhost:3000/profissionais';


document.querySelector('.register form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.register input[placeholder="nome de usuário"]')?.value.trim();
    const email = document.querySelector('.register input[placeholder="Email"]')?.value.trim();
    const password = document.querySelector('.register input[placeholder="senha"]')?.value;

    
    const especialidade = document.querySelector('#modalprofissionais input[placeholder="Especialidade"]')?.value.trim();
    const localizacao = document.querySelector('#modalprofissionais input[placeholder="Localização de atendimento"]')?.value.trim();
    const horario = document.querySelector('#modalprofissionais input[placeholder="Horário de atendimento"]')?.value.trim();
    const telefone = document.querySelector('#modalprofissionais input[placeholder="Telefone para contato"]')?.value.trim();

    if (!username || !email || !password || !especialidade || !localizacao || !horario || !telefone) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    
    const res = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}`);
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
document.querySelector('.login form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.login input[placeholder="Nome de usuário"]')?.value.trim();
    const password = document.querySelector('.login input[placeholder="senha"]')?.value;

    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }

    const res = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    const users = await res.json();

    if (users.length > 0) {
        alert(`Login bem-sucedido. Bem-vindo, ${users[0].username}!`);
        
    } else {
        alert('Nome de usuário ou senha incorretos.');
    }
});


const localizacaoInput = document.getElementById('localizacao');
localizacaoInput?.addEventListener('input', () => {
    if (localizacaoInput.value.length > 100) {
        localizacaoInput.value = localizacaoInput.value.slice(0, 100);
    }
});


const telefoneInput = document.getElementById('telefone');

telefoneInput?.addEventListener('input', function (e) {
    let x = e.target.value.replace(/\D/g, '').slice(0, 11); 
    
    if (x.length > 10) { 
        x = x.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (x.length > 5) { 
        x = x.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (x.length > 2) { 
        x = x.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (x.length > 0) { 
        x = x.replace(/^(\d{0,2})/, '($1');
    }

    e.target.value = x;
});


const emailInput = document.querySelector('input[type="email"]');

emailInput?.addEventListener('input', (e) => {
    let val = e.target.value;

    
    if (val.includes('@')) {
        const parts = val.split('@');
        
        let userPart = parts[0].replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
        
        val = userPart + '@gmail.com';
    } else {
      
        val = val.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
    }

    e.target.value = val;
});
