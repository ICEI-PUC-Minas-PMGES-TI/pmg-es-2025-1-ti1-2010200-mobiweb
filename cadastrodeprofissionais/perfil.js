const JSON_SERVER_URL = 'http://localhost:3000'; // Base URL do seu JSON Server

window.addEventListener('DOMContentLoaded', async () => {
    
    const loggedInUserId = localStorage.getItem('usuarioLogadoId'); 
    
    if (!loggedInUserId) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../cadastrouser/profissionais.html'; 
        return;
    }

    let userProfile = null; 

    try {
   
        const response = await fetch(`${JSON_SERVER_URL}/profissionais/${loggedInUserId}`);
        
        if (!response.ok) {
          
            if (response.status === 404) {
                throw new Error('Perfil não encontrado para o ID fornecido.');
            }
            throw new Error(`Erro ao buscar perfil: ${response.status} ${response.statusText}`);
        }
        
        userProfile = await response.json(); 
        preencherCampos(userProfile); 

    } catch (error) {
        console.error('Erro ao carregar o perfil:', error);
        alert('Não foi possível carregar seu perfil. Por favor, tente novamente mais tarde.');
       
        window.location.href = 'profissionais.html'; 
        return;
    }

  
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('usuarioLogadoId'); 
        window.location.href = 'profissionais.html';
    });

    let editando = false;

   
    document.getElementById('editarBtn').addEventListener('click', async () => {
        const campos = ['username', 'email', 'especialidade', 'localizacao', 'horario', 'telefone'];

        if (!editando) {
        
            campos.forEach(campo => {
                const p = document.getElementById(campo);
                const input = document.createElement('input');
                input.type = 'text';
                input.id = `input-${campo}`;
          
                input.value = userProfile[campo] || ''; 
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

        
            const dadosParaAtualizarNoServer = { ...userProfile, ...novosDados }; 

            try {
                
                const response = await fetch(`${JSON_SERVER_URL}/profissionais/${loggedInUserId}`, {
                    method: 'PUT', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosParaAtualizarNoServer)
                });

                if (!response.ok) {
                    throw new Error(`Erro ao salvar perfil: ${response.status} ${response.statusText}`);
                }

               
                userProfile = await response.json(); 
                alert('Perfil atualizado com sucesso!');

               
                campos.forEach(campo => {
                    const input = document.getElementById(`input-${campo}`);
                    const p = document.createElement('p');
                    p.id = campo;
                   
                    p.textContent = userProfile[campo] || ''; 
                    input.replaceWith(p);
                });

                document.getElementById('editarBtn').textContent = 'Editar';
                editando = false;

            } catch (error) {
                console.error('Erro ao atualizar o perfil:', error);
                alert('Não foi possível salvar as alterações. Verifique sua conexão ou tente novamente.');
            }
        }
    });


    document.getElementById('excluirBtn').addEventListener('click', async () => {
        const confirmar = confirm('Tem certeza que deseja excluir sua conta? Essa ação é irreversível.');
        if (confirmar) {
            try {
                

                const response = await fetch(`${JSON_SERVER_URL}/profissionais/${loggedInUserId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`Erro ao excluir conta: ${response.status} ${response.statusText}`);
                }

                localStorage.removeItem('usuarioLogadoId'); 
                alert('Conta excluída com sucesso.');
                window.location.href = 'profissionais.html';
            } catch (error) {
                console.error('Erro ao excluir conta:', error);
                alert('Não foi possível excluir sua conta. Tente novamente.');
            }
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