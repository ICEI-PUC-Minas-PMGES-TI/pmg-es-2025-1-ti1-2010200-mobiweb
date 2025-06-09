const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

registerBtn?.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn?.addEventListener('click', () => {
    container.classList.remove('active');
});

function getProfissionais() {
    return JSON.parse(localStorage.getItem('profissionais')) || [];
}

function salvarProfissional(profissional) {
    const profissionais = getProfissionais();
    profissionais.push(profissional);
    localStorage.setItem('profissionais', JSON.stringify(profissionais));
}

document.querySelector('.register form')?.addEventListener('submit', (e) => {
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

    const profissionais = getProfissionais();
    const userExiste = profissionais.some(p => p.username === username);

    if (userExiste) {
        alert('Nome de usuário já está em uso.');
        return;
    }

    const novoProfissional = {
        username,
        email,
        password,
        especialidade,
        localizacao,
        horario,
        telefone
    };

    salvarProfissional(novoProfissional);

    // Salva o profissional como logado após cadastro
    localStorage.setItem('usuarioLogado', JSON.stringify(novoProfissional));

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'perfil.html';
});

document.querySelector('.login form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.querySelector('.login input[placeholder="Nome de usuário"]')?.value.trim();
    const password = document.querySelector('.login input[placeholder="senha"]')?.value;

    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }

    const profissionais = getProfissionais();
    const usuario = profissionais.find(p => p.username === username && p.password === password);

    if (usuario) {
        // Salva o usuário logado no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));

        alert(`Login bem-sucedido. Bem-vindo, ${usuario.username}!`);
        window.location.href = 'perfil.html';
    } else {
        alert('Nome de usuário ou senha incorretos.');
    }
});

// Limita localização
document.getElementById('localizacao')?.addEventListener('input', (e) => {
    if (e.target.value.length > 100) {
        e.target.value = e.target.value.slice(0, 100);
    }
});

// Máscara telefone
document.getElementById('telefone')?.addEventListener('input', function (e) {
    let x = e.target.value.replace(/\D/g, '').slice(0, 11);

    if (x.length > 10) {
        x = x.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (x.length > 5) {
        x = x.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (x.length > 2) {
        x = x.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
        x = x.replace(/^(\d{0,2})/, '($1');
    }

    e.target.value = x;
});

// Formatação básica de email
document.querySelector('input[type="email"]')?.addEventListener('input', (e) => {
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
