const professionals = [
    {
        nome: "Maria Oliveira",
        especialidade: "Ortopedia",
        instagram: "@mariafisio",
        link: "https://instagram.com/mariafisio",
        descricao: "Especialista em reabilitação ortopédica com 10 anos de experiência.",
        foto: "https://via.placeholder.com/120"
    },
    {
        nome: "João Silva",
        especialidade: "Fisioterapia esportiva",
        instagram: "@joaofisio",
        link: "https://instagram.com/joaofisio",
        descricao: "Atua com atletas e lesões esportivas, com foco em performance.",
        foto: "https://via.placeholder.com/120"
    },
    {
        nome: "Fernanda Lima",
        especialidade: "Fisioterapia pélvica",
        instagram: "@fernandafisio",
        link: "https://instagram.com/fernandafisio",
        descricao: "Ajuda mulheres com fortalecimento do assoalho pélvico.",
        foto: "https://via.placeholder.com/120"
    }
];

const container = document.getElementById('card-container');
const modal = document.getElementById('modal');
const modalName = document.getElementById('modal-name');
const modalSpecialty = document.getElementById('modal-specialty');
const modalInstagram = document.getElementById('modal-instagram');
const modalDescription = document.getElementById('modal-description');

professionals.forEach((prof) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${prof.foto}" alt="Foto de ${prof.nome}">
        <h3>${prof.nome}</h3>
        <p><strong>Especialidade:</strong> ${prof.especialidade}</p>
        <p><strong>Instagram:</strong> <a href="${prof.link}" target="_blank">${prof.instagram}</a></p>
    `;
    card.addEventListener('click', () => openModal(prof));
    container.appendChild(card);
});

function openModal(prof) {
    modalName.textContent = prof.nome;
    modalSpecialty.textContent = prof.especialidade;
    modalInstagram.textContent = prof.instagram;
    modalInstagram.href = prof.link;
    modalDescription.textContent = prof.descricao;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

// Fechar ao clicar fora
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
};
