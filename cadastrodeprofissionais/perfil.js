window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!user) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'profissionais.html';
        return;
    }

    preencherCampos(user);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'profissionais.html';
    });

    let editando = false;

    document.getElementById('editarBtn').addEventListener('click', () => {
        const campos = ['username', 'email', 'especialidade', 'localizacao', 'horario', 'telefone'];

        if (!editando) {
            campos.forEach(campo => {
                const p = document.getElementById(campo);
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `input-${campo}`;
                input.value = p.textContent;
                input.classList.add('editable-input');
                p.replaceWith(input);
            });

            document.getElementById('editarBtn').textContent = 'Salvar';
            editando = true;
        } else {
            const novosDados = {};
            campos.forEach(campo => {
                const input = document.getElementById(`input-${campo}`);
                novosDados[campo] = input.value.trim();
            });

            const usuarioAtualizado = { ...user, ...novosDados };
            localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));

            // Atualiza também na lista de profissionais
            const profissionais = JSON.parse(localStorage.getItem('profissionais')) || [];
            const atualizados = profissionais.map(p =>
                p.username === user.username ? usuarioAtualizado : p
            );
            localStorage.setItem('profissionais', JSON.stringify(atualizados));

            campos.forEach(campo => {
                const input = document.getElementById(`input-${campo}`);
                const p = document.createElement('p');
                p.id = campo;
                p.textContent = novosDados[campo];
                input.replaceWith(p);
            });

            document.getElementById('editarBtn').textContent = 'Editar';
            editando = false;
        }
    });

    document.getElementById('excluirBtn').addEventListener('click', () => {
        const confirmar = confirm('Tem certeza que deseja excluir sua conta? Essa ação é irreversível.');
        if (confirmar) {
            // Remove da lista de profissionais
            const profissionais = JSON.parse(localStorage.getItem('profissionais')) || [];
            const atualizados = profissionais.filter(p => p.username !== user.username);
            localStorage.setItem('profissionais', JSON.stringify(atualizados));

            // Remove o login atual
            localStorage.removeItem('usuarioLogado');

            alert('Conta excluída com sucesso.');
            window.location.href = 'profissionais.html';
        }
    });
});

function preencherCampos(user) {
    document.getElementById('username').textContent = user.username || '';
    document.getElementById('email').textContent = user.email || '';
    document.getElementById('especialidade').textContent = user.especialidade || '';
    document.getElementById('localizacao').textContent = user.localizacao || '';
    document.getElementById('horario').textContent = user.horario || '';
    document.getElementById('telefone').textContent = user.telefone || '';
}
