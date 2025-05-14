document.addEventListener('DOMContentLoaded', function() {
    // Dados dos profissionais
    const professionals = {
        maria: {
            name: "Maria Oliveira",
            specialty: "Ortopedia",
            image: "https://via.placeholder.com/120",
            description: "Fisioterapeuta especializada em ortopedia...",
            education: "Graduada em Fisioterapia pela UFMG...",
            experience: "10 anos de experiência...",
            whatsapp: "(11) 98765-4321",
            email: "maria@exemplo.com",
            instagramUrl: "https://instagram.com/mariafisio"
        },
        joao: {
            name: "João Silva",
            specialty: "Fisioterapia esportiva",
            image: "https://via.placeholder.com/120",
            description: "Especialista em fisioterapia esportiva...",
            education: "Mestre em Fisioterapia...",
            experience: "8 anos de experiência...",
            whatsapp: "(11) 91234-5678",
            email: "joao@exemplo.com",
            instagramUrl: "https://instagram.com/joaofisio"
        },
        fernanda: {
            name: "Fernanda Lima",
            specialty: "Fisioterapia pélvica",
            image: "https://via.placeholder.com/120",
            description: "Especialista em fisioterapia pélvica...",
            education: "Doutora em Fisioterapia...",
            experience: "12 anos de experiência...",
            whatsapp: "(11) 99876-5432",
            email: "fernanda@exemplo.com",
            instagramUrl: "https://instagram.com/fernandafisio"
        }
    };

    // Seleciona elementos
    const modal = document.getElementById('professionalModal');
    const modalBody = document.querySelector('.modal-body');
    const closeBtn = document.querySelector('.close-modal');

    // Adiciona evento de clique para cada card
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function() {
            const professionalId = this.getAttribute('data-professional');
            const professional = professionals[professionalId];
            
            if (professional) {
                modalBody.innerHTML = `
                    <div class="modal-header">
                        <img src="${professional.image}" alt="${professional.name}">
                        <div>
                            <h2>${professional.name}</h2>
                            <p><strong>Especialidade:</strong> ${professional.specialty}</p>
                        </div>
                    </div>
                    <div class="info-group">
                        <h3>Sobre</h3>
                        <p>${professional.description}</p>
                    </div>
                    <div class="info-group">
                        <h3>Formação</h3>
                        <p>${professional.education}</p>
                    </div>
                    <div class="info-group">
                        <h3>Experiência</h3>
                        <p>${professional.experience}</p>
                    </div>
                    <div class="info-group">
                        <h3>Contato</h3>
                        <p><strong>WhatsApp:</strong> ${professional.whatsapp}</p>
                        <p><strong>Email:</strong> ${professional.email}</p>
                    </div>
                    <div class="social-links">
                        <a href="${professional.instagramUrl}" target="_blank">Instagram</a>
                        <a href="https://wa.me/55${professional.whatsapp.replace(/\D/g, '')}" target="_blank">WhatsApp</a>
                    </div>
                `;
                
                modal.style.display = 'block';
            }
        });
    });

    // Fechar modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Fechar ao clicar fora
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});