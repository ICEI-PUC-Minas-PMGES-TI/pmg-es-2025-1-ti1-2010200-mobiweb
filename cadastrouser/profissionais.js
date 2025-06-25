const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// URL da API json-server
const apiUrl = 'http://localhost:3000/profissionais';

registerBtn?.addEventListener('click', () => {
    container.classList.add('active');
});

loginBtn?.addEventListener('click', () => {
    container.classList.remove('active');
});

// ---------- Upload da imagem de perfil com redimensionamento e compressão ----------
const fileInput = document.getElementById('fileInput');
const addImg = document.getElementById('addimg');
let imagemBase64 = '';

addImg?.addEventListener('click', () => {
    fileInput.click();
});

fileInput?.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const maxSize = 200; // Tamanho máximo para largura/altura

                let width = img.width;
                let height = img.height;

                // Mantém proporção da imagem
                if (width > height) {
                    if (width > maxSize) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(img, 0, 0, width, height);

                // Converte para base64 com compressão jpeg qualidade 0.7 (70%)
                imagemBase64 = canvas.toDataURL('image/jpeg', 0.7);

                // Substitui ícone pela imagem redimensionada e arredondada
                addImg.innerHTML = `
                    <img src="${imagemBase64}" alt="Foto de perfil"
                         style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
                `;
            };

            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

// ---------- Cadastro de profissional ----------
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

    try {
        const response = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}`);
        const existingUsers = await response.json();

        if (existingUsers.length > 0) {
            alert('Nome de usuário já está em uso.');
            return;
        }
    } catch (error) {
        console.error('Erro ao verificar usuário existente:', error);
        alert('Erro ao verificar nome de usuário.');
        return;
    }

    const novoProfissional = {
        username,
        email,
        password,
        especialidade,
        localizacao,
        horario,
        telefone,
        imagem: imagemBase64 // Adiciona imagem no cadastro
    };

    try {
        const response = await fetch(apiUrl, {
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
        console.log('Profissional salvo:', data);

        localStorage.setItem('usuarioLogado', JSON.stringify(novoProfissional));

        alert('Cadastro realizado com sucesso!');
        window.location.href = 'cadastropadrao.html';
    } catch (error) {
        console.error('Erro ao cadastrar profissional:', error);
        alert('Erro ao cadastrar. Tente novamente.');
    }
});

// ---------- Login de profissional ----------
document.querySelector('.login form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.querySelector('.login input[placeholder="Nome de usuário"]')?.value.trim();
    const password = document.querySelector('.login input[placeholder="senha"]')?.value;

    if (!username || !password) {
        alert('Preencha usuário e senha.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
        const users = await response.json();

        if (users.length > 0) {
            localStorage.setItem('usuarioLogado', JSON.stringify(users[0]));
            alert(`Login bem-sucedido. Bem-vindo, ${users[0].username}!`);
            window.location.href = '../guilherme/home.html';
        } else {
            alert('Usuário ou senha incorretos.');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro ao fazer login.');
    }
});

// ---------- Limita localização ----------
document.getElementById('localizacao')?.addEventListener('input', (e) => {
    if (e.target.value.length > 100) {
        e.target.value = e.target.value.slice(0, 100);
    }
});

// ---------- Máscara de telefone ----------
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

// ---------- Validação básica de email ----------
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
