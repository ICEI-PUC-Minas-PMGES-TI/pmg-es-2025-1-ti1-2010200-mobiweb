// Arquivo: seu_script_profissionais.js (ou o nome do seu arquivo atual para profissionais)

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Defina a URL da API para a coleção 'profissionais'
const apiUrl = 'http://localhost:3000/profissionais';

registerBtn?.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn?.addEventListener('click', () => {
    container.classList.remove('active');
});

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

    // --- VERIFICAR SE O USUÁRIO (PROFISSIONAL) JÁ EXISTE NO DB.JSON ---
    try {
        const response = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}`);
        const existingUsers = await response.json();

        if (existingUsers.length > 0) {
            alert('Nome de usuário já está em uso.');
            return;
        }
    } catch (error) {
        console.error('Erro ao verificar usuário existente (profissional):', error);
        alert('Erro ao verificar nome de usuário. Tente novamente.');
        return;
    }

    const novoProfissional = {
        username,
        email,
        // É uma boa prática não salvar a senha em texto puro em um ambiente real.
        // json-server é para prototipagem, então está ok por enquanto.
        password,
        especialidade,
        localizacao,
        horario,
        telefone
    };

    // --- ENVIAR DADOS PARA O DB.JSON (coleção 'profissionais') ---
    try {
        const response = await fetch(apiUrl, { // POST para a URL de profissionais
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProfissional)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Profissional salvo no db.json:', data);

        // Salva o profissional como logado (temporariamente no localStorage do navegador)
        localStorage.setItem('usuarioLogado', JSON.stringify(novoProfissional));

        alert('Cadastro de profissional realizado com sucesso!');
        window.location.href = 'cadastropadrao.html'; // Redirecionamento após cadastro
    } catch (error) {
        console.error('Erro ao cadastrar profissional:', error);
        alert('Erro ao realizar o cadastro de profissional. Tente novamente.');
    }
});


document.querySelector('.login form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.login input[placeholder="Nome de usuário"]')?.value.trim();
    const password = document.querySelector('.login input[placeholder="senha"]')?.value;

    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }

    try {
        // --- BUSCAR PROFISSIONAL NO DB.JSON PARA LOGIN ---
        // A busca é feita na URL de profissionais
        const response = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
        const users = await response.json();

        if (users.length > 0) {
            localStorage.setItem('usuarioLogado', JSON.stringify(users[0]));
            alert(`Login de profissional bem-sucedido. Bem-vindo, ${users[0].username}!`);
            window.location.href = '../guilherme/home.html';
        } else {
            alert('Nome de usuário ou senha de profissional incorretos.');
        }
    } catch (error) {
        console.error('Erro durante o login de profissional:', error);
        alert('Ocorreu um erro ao tentar fazer login de profissional. Tente novamente mais tarde.');
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
        val = userPart + '@gmail.com'; // Ou permita que o usuário digite o domínio completo
    } else {
        val = val.replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
    }

    e.target.value = val;
});