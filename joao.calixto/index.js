document.addEventListener('DOMContentLoaded', () => {
    const formTitle = document.getElementById('formTitle');
    const btnSalvar = document.getElementById('btnSalvar');
    const listaPontos = document.getElementById('listaPontos');
    const barraPesquisa = document.getElementById('barraPesquisa');
    const btnPesquisar = document.getElementById('btnPesquisar');
    const listaFavoritos = document.getElementById('listaFavoritos'); // Para a página de favoritos

    const editandoId = localStorage.getItem('editandoId');

    // Lógica para o formulário de cadastro/edição
    if (formTitle) {
        formTitle.textContent = editandoId ? 'Editar Local Acessível' : 'Informações do Local Acessível';
    }

    if (editandoId && document.getElementById('nomeLocal')) {
        fetch(`http://localhost:3000/pontosAcessiveis/${editandoId}`)
            .then(res => res.json())
            .then(ponto => {
                document.getElementById('nomeLocal').value = ponto.nomeLocal;
                document.getElementById('bairro').value = ponto.bairro;
                document.getElementById('rua').value = ponto.rua;
                document.getElementById('numero').value = ponto.numero;
                document.getElementById('referencia').value = ponto.referencia || '';
                document.getElementById('tipoAcessibilidade').value = ponto.tipoAcessibilidade || '';
                document.getElementById('descricaoAdicional').value = ponto.descricaoAdicional || '';
            })
            .catch(error => console.error("Erro ao carregar para edição:", error));
    }

    if (btnSalvar) {
        btnSalvar.addEventListener('click', (e) => {
            e.preventDefault();
            const nomeLocal = document.getElementById('nomeLocal').value.trim();
            const bairro = document.getElementById('bairro').value.trim();
            const rua = document.getElementById('rua').value.trim();
            const numero = document.getElementById('numero').value.trim();

            if (!nomeLocal || !bairro || !rua || !numero) {
                alert('Por favor, preencha os campos obrigatórios: Nome do Local, Bairro, Rua e Número.');
                return;
            }

            const ponto = {
                nomeLocal,
                bairro,
                rua,
                numero,
                referencia: document.getElementById('referencia').value.trim(),
                tipoAcessibilidade: document.getElementById('tipoAcessibilidade').value.trim(),
                descricaoAdicional: document.getElementById('descricaoAdicional').value.trim()
                // Futuramente, você pode adicionar latitude e longitude aqui
                // latitude: null,
                // longitude: null
            };

            const url = editandoId ? `http://localhost:3000/pontosAcessiveis/${editandoId}` : 'http://localhost:3000/pontosAcessiveis';
            const method = editandoId ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ponto)
            })
            .then(res => res.json())
            .then(() => {
                localStorage.removeItem('editandoId'); // Limpa o ID de edição
                window.location.href = 'teste.html'; // Redireciona para a lista de pontos
            })
            .catch(error => console.error("Erro ao salvar/editar:", error));
        });
    }

    // --- Lógica para a página de LISTAGEM (teste.html) ---
    if (listaPontos) {
        // Função para carregar e exibir os pontos (com filtro para pesquisa)
        const carregarPontos = (termoPesquisa = '') => {
            fetch('http://localhost:3000/pontosAcessiveis')
                .then(res => res.json())
                .then(pontos => {
                    listaPontos.innerHTML = ''; // Limpa a lista antes de adicionar novos
                    const pontosFavoritosIds = JSON.parse(localStorage.getItem('favoritos') || '[]');

                    // Filtra os pontos com base no termo de pesquisa
                    const pontosFiltrados = pontos.filter(ponto => {
                        const termo = termoPesquisa.toLowerCase();
                        return ponto.nomeLocal.toLowerCase().includes(termo) ||
                               ponto.bairro.toLowerCase().includes(termo) ||
                               ponto.rua.toLowerCase().includes(termo) ||
                               (ponto.tipoAcessibilidade && ponto.tipoAcessibilidade.toLowerCase().includes(termo)); // Pesquisa também por tipo de acessibilidade
                    });

                    if (pontosFiltrados.length === 0) {
                        listaPontos.innerHTML = '<p class="text-muted">Nenhum local encontrado com os critérios de pesquisa.</p>';
                        return;
                    }

                    pontosFiltrados.forEach(ponto => {
                        const isFavorito = pontosFavoritosIds.includes(ponto.id);
                        const card = document.createElement('div');
                        card.className = 'col-12 col-md-6';
                        card.innerHTML = `
                            <div class="card shadow-sm p-3" data-id="${ponto.id}">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">${ponto.nomeLocal}</h5>
                                    <button class="btn btn-link btn-sm btn-favoritar" data-id="${ponto.id}">
                                        <i class="bi ${isFavorito ? 'bi-heart-fill text-danger' : 'bi-heart'}" style="font-size: 1.5rem;"></i>
                                    </button>
                                </div>
                                <p class="mb-1"><strong>Bairro:</strong> ${ponto.bairro}</p>
                                <p class="mb-1"><strong>Rua:</strong> ${ponto.rua}, ${ponto.numero}</p>
                                <p class="mb-1"><strong>Referência:</strong> ${ponto.referencia || 'Nenhuma'}</p>
                                <p class="mb-1"><strong>Tipo de Acessibilidade:</strong> ${ponto.tipoAcessibilidade || 'Não informado'}</p>
                                <p class="mb-2"><strong>Descrição Adicional:</strong> ${ponto.descricaoAdicional || 'Nenhuma'}</p>
                                <div class="d-flex justify-content-end gap-2">
                                    <button class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
                                    <button class="btn btn-sm btn-outline-danger btn-excluir">Excluir</button>
                                </div>
                            </div>
                        `;
                        listaPontos.appendChild(card);
                    });

                    // Adicionar event listeners para os botões APÓS eles serem criados
                    document.querySelectorAll('.btn-editar').forEach(botao => {
                        botao.addEventListener('click', function() {
                            const id = this.closest('.card').dataset.id;
                            editarPonto(id);
                        });
                    });

                    document.querySelectorAll('.btn-excluir').forEach(botao => {
                        botao.addEventListener('click', function() {
                            const id = this.closest('.card').dataset.id;
                            excluirPonto(id);
                        });
                    });

                    document.querySelectorAll('.btn-favoritar').forEach(botao => {
                        botao.addEventListener('click', function() {
                            // CORREÇÃO AQUI: Não converta para número se o ID for string
                            const id = this.dataset.id;
                            toggleFavorito(id, this);
                        });
                    });
                })
                .catch(error => console.error("Erro ao carregar pontos:", error));
        };

        // Event listener para a barra de pesquisa (ao digitar)
        if (barraPesquisa) {
            barraPesquisa.addEventListener('input', (e) => {
                carregarPontos(e.target.value);
            });
        }

        // Event listener para o botão de pesquisa (clique)
        if (btnPesquisar) {
            btnPesquisar.addEventListener('click', () => {
                carregarPontos(barraPesquisa.value);
            });
        }

        // Carrega os pontos ao iniciar a página teste.html
        carregarPontos();
    }

    // --- Lógica para a página de FAVORITOS (favoritos.html) ---
    if (listaFavoritos) {
        const carregarFavoritos = () => {
            let favoritosIds = JSON.parse(localStorage.getItem('favoritos') || '[]');
            listaFavoritos.innerHTML = '';

            if (favoritosIds.length === 0) {
                listaFavoritos.innerHTML = '<p class="text-muted">Você ainda não favoritou nenhum local.</p>';
                return;
            }

            // Busca todos os pontos e filtra pelos IDs favoritos
            fetch('http://localhost:3000/pontosAcessiveis')
                .then(res => res.json())
                .then(pontos => {
                    // Garanta que os IDs nos favoritos sejam strings para a comparação correta
                    const pontosFavoritos = pontos.filter(ponto => favoritosIds.includes(ponto.id));

                    if (pontosFavoritos.length === 0) {
                        listaFavoritos.innerHTML = '<p class="text-muted">Nenhum local favorito encontrado no momento (verifique o JSON Server).</p>';
                        return;
                    }

                    pontosFavoritos.forEach(ponto => {
                        const card = document.createElement('div');
                        card.className = 'col-12 col-md-6';
                        card.innerHTML = `
                            <div class="card shadow-sm p-3" data-id="${ponto.id}">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">${ponto.nomeLocal}</h5>
                                    <button class="btn btn-link btn-sm btn-remover-favorito" data-id="${ponto.id}">
                                        <i class="bi bi-heart-fill text-danger" style="font-size: 1.5rem;"></i>
                                    </button>
                                </div>
                                <p class="mb-1"><strong>Bairro:</strong> ${ponto.bairro}</p>
                                <p class="mb-1"><strong>Rua:</strong> ${ponto.rua}, ${ponto.numero}</p>
                                <p class="mb-1"><strong>Referência:</strong> ${ponto.referencia || 'Nenhuma'}</p>
                                <p class="mb-1"><strong>Tipo de Acessibilidade:</strong> ${ponto.tipoAcessibilidade || 'Não informado'}</p>
                                <p class="mb-2"><strong>Descrição Adicional:</strong> ${ponto.descricaoAdicional || 'Nenhuma'}</p>
                            </div>
                        `;
                        listaFavoritos.appendChild(card);
                    });

                    // Adicionar event listeners para remover favorito
                    document.querySelectorAll('.btn-remover-favorito').forEach(botao => {
                        botao.addEventListener('click', function() {
                            // CORREÇÃO AQUI: Não converta para número se o ID for string
                            const id = this.dataset.id;
                            removerFavorito(id);
                        });
                    });
                })
                .catch(error => console.error("Erro ao carregar favoritos:", error));
        };

        // Carrega os favoritos ao iniciar a página favoritos.html
        carregarFavoritos();
    }

    // --- Funções Auxiliares ---

    // Função para editar um ponto
    function editarPonto(id) {
        localStorage.setItem('editandoId', id);
        window.location.href = 'formulario.html';
    }

    // Função para excluir um ponto
    function excluirPonto(id) {
        if (confirm('Tem certeza que deseja excluir este ponto?')) {
            fetch(`http://localhost:3000/pontosAcessiveis/${id}`, {
                method: 'DELETE'
            })
            .then(res => {
                if (res.ok) { // Verifica se a exclusão foi bem sucedida
                    // Se estiver na página de pontos, recarrega
                    if (listaPontos) {
                        carregarPontos(barraPesquisa.value);
                    } else if (listaFavoritos) { // Se estiver na página de favoritos, recarrega favoritos
                        carregarFavoritos();
                    }
                } else {
                    console.error("Erro ao excluir ponto:", res.statusText);
                    alert("Erro ao excluir o ponto. Tente novamente.");
                }
            })
            .catch(error => console.error("Erro ao excluir:", error));
        }
    }

    // Função para alternar o estado de favorito de um ponto
    function toggleFavorito(id, buttonElement) {
        let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
        // O indexOf funciona para strings e números, mas a comparação `includes` é mais robusta para arrays
        const index = favoritos.indexOf(id); // O ID agora é tratado como string

        const iconElement = buttonElement.querySelector('i');

        if (index > -1) {
            // Remover dos favoritos
            favoritos.splice(index, 1);
            iconElement.classList.remove('bi-heart-fill', 'text-danger');
            iconElement.classList.add('bi-heart');
        } else {
            // Adicionar aos favoritos
            favoritos.push(id);
            iconElement.classList.remove('bi-heart');
            iconElement.classList.add('bi-heart-fill', 'text-danger');
        }
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        // Se estiver na página de favoritos, atualize a lista para mostrar a remoção imediatamente
        if (listaFavoritos) {
            carregarFavoritos();
        }
    }

    // Função para remover favorito da lista de favoritos (usada na página favoritos.html)
    function removerFavorito(id) {
        if (confirm('Tem certeza que deseja remover este local dos favoritos?')) {
            let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
            const index = favoritos.indexOf(id); // O ID agora é tratado como string
            if (index > -1) {
                favoritos.splice(index, 1);
                localStorage.setItem('favoritos', JSON.stringify(favoritos));
                carregarFavoritos(); // Recarrega a lista após a remoção
            }
        }
    }
});

document.querySelector('#exampleModalToggle .btn-dark').addEventListener('click', () => {
  const nota = document.getElementById('notaSelect').value;
  const recomendacao = document.getElementById('recomendacaoSelect').value;
  const comentario = document.getElementById('floatingInput').value;
  const imagem = document.getElementById('formFileSingle').files[0]?.name || '';

  const avaliacao = {
    nota,
    recomendacao,
    comentario,
    imagem
  };

  fetch('http://localhost:3000/avaliacoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(avaliacao)
  })
  .then(response => response.json())
  .then(data => {
    alert('Avaliação salva com sucesso!');
    console.log(data);
  })
  .catch(error => {
    console.error('Erro ao salvar avaliação:', error);
  });
});
