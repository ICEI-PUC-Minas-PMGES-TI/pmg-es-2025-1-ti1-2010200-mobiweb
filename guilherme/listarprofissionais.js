// listarProfissionais.js

async function carregarProfissionais() {
    try {
        const response = await fetch('http://localhost:3000/profissionais');
        const profissionais = await response.json();

        const container = document.getElementById('lista-profissionais');
        container.innerHTML = '';

        profissionais.forEach(prof => {
            const bloco = document.createElement('div');
            bloco.className = 'col-lg-3 col-md-6 col-12 mb-4 profissional';
            bloco.setAttribute('data-nome', prof.username);
            bloco.setAttribute('data-especialidade', prof.especialidade);

            bloco.innerHTML = `
                <div class="member-block">
                    <div class="member-block-image-wrap">
                        <img src="${prof.imagem || '../guilherme/images/default-user.png'}" class="member-block-image img-fluid" alt="${prof.username}">
                        <ul class="social-icon">
                            <li>${prof.telefone}</li>
                            <li>${prof.horario}</li>
                            <li>${prof.localizacao}</li>
                        </ul>
                    </div>
                    <div class="member-block-info d-flex align-items-center">
                        <h4>${prof.username}</h4>
                        <p class="ms-auto">${prof.especialidade}</p>
                    </div>
                </div>
            `;

            container.appendChild(bloco);
        });
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
        alert('Erro ao carregar profissionais.');
    }
}

document.addEventListener('DOMContentLoaded', carregarProfissionais);
