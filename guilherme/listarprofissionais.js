let profissionais = [];
let exibidos = 0;
const LIMITE_INICIAL = 6;

async function carregarProfissionais() {
    try {
        const response = await fetch('http://localhost:3000/profissionais');
        profissionais = await response.json();

        exibidos = 0; // Zera contador
        document.getElementById('lista-profissionais').innerHTML = ''; // Limpa

        exibirProximosProfissionais(LIMITE_INICIAL);
    } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
    }
}

function exibirProximosProfissionais(qtd) {
    const container = document.getElementById('lista-profissionais');
    const slice = profissionais.slice(exibidos, exibidos + qtd);

    slice.forEach(prof => {
        const bloco = document.createElement('div');
        bloco.className = 'col-lg-4 col-md-6 col-12 mb-4 profissional';
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

    exibidos += slice.length;

    // Oculta botão se tudo já estiver exibido
    const verMaisBtn = document.getElementById('ver-mais-btn');
    if (exibidos >= profissionais.length) {
        verMaisBtn.style.display = 'none';
    } else {
        verMaisBtn.style.display = 'inline-block';
    }
}

document.addEventListener('DOMContentLoaded', carregarProfissionais);

document.getElementById('ver-mais-btn')?.addEventListener('click', () => {
    exibirProximosProfissionais(6); // mostra mais 6
});
