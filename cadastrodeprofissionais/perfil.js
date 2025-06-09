const apiUrl = 'http://localhost:3000/profissionais';

window.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!user) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'profissionais.html';
        return;
    }

    // Preencher os campos com os dados
    document.getElementById('username').textContent = user.username;
    document.getElementById('email').textContent = user.email;
    document.getElementById('especialidade').textContent = user.especialidade;
    document.getElementById('localizacao').textContent = user.localizacao;
    document.getElementById('horario').textContent = user.horario;
    document.getElementById('telefone').textContent = user.telefone;
});

// Botão de logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'profissionais.html';
});

// Botão de editar
document.getElementById('editarBtn').addEventListener('click', () => {
    alert('Funcionalidade de edição ainda será implementada.');
});

// Botão de excluir conta
document.getElementById('excluirBtn').addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!user) return;

    const confirmDelete = confirm('Tem certeza que deseja excluir sua conta? Essa ação é irreversível.');

    if (confirmDelete) {
        await fetch(`${apiUrl}/${user.id}`, {
            method: 'DELETE'
        });

        localStorage.removeItem('usuarioLogado');
        alert('Conta excluída com sucesso.');
        window.location.href = 'profissionais.html';
    }
});
