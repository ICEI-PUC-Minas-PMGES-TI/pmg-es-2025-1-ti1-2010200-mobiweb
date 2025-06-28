document.addEventListener("DOMContentLoaded", function () {
  const btnLogin = document.getElementById("btn-login");
  const usuarioLogadoStr = localStorage.getItem("usuarioLogado");

  const inputFotoPerfil = document.getElementById('inputFotoPerfil');
  const imgPreview = document.getElementById('imgPreview');
  const formEditarPerfil = document.getElementById('formEditarPerfil');
  const btnExcluirConta = document.getElementById('btnExcluirConta');
  const profissionalCampos = document.getElementById('profissionalCampos');
  const fotoPerfilContainer = document.getElementById('fotoPerfilContainer');

  if (usuarioLogadoStr && btnLogin) {
    try {
      const usuario = JSON.parse(usuarioLogadoStr);
      btnLogin.textContent = usuario.username || "Usuário";

      btnLogin.removeAttribute("data-bs-toggle");
      btnLogin.removeAttribute("aria-controls");
      btnLogin.removeAttribute("href");
      btnLogin.style.cursor = "pointer";

      btnLogin.addEventListener("click", () => {
        const modalEditarPerfil = new bootstrap.Modal(document.getElementById('modalEditarPerfil'));
        modalEditarPerfil.show();
        preencherFormularioEditarPerfil(usuario);
      });
    } catch (e) {
      console.error("Erro ao processar usuário logado:", e);
    }
  }

  function preencherFormularioEditarPerfil(usuario) {
    document.getElementById('editUsername').value = usuario.username || '';
    document.getElementById('editEmail').value = usuario.email || '';

    // Mostrar ou esconder foto e campos profissionais
    if (usuario.especialidade) {
      fotoPerfilContainer.style.display = 'block';
      profissionalCampos.style.display = 'block';

      document.getElementById('editEspecialidade').value = usuario.especialidade || '';
      document.getElementById('editLocalizacao').value = usuario.localizacao || '';
      document.getElementById('editHorario').value = usuario.horario || '';
      document.getElementById('editTelefone').value = usuario.telefone || '';

      if (usuario.imagem) {
        imgPreview.src = usuario.imagem;
      } else {
        imgPreview.src = 'default-avatar.png';
      }

    } else {
      fotoPerfilContainer.style.display = 'none';
      profissionalCampos.style.display = 'none';
    }
  }

  if (imgPreview && inputFotoPerfil) {
    imgPreview.addEventListener('click', () => {
      inputFotoPerfil.click();
    });

    inputFotoPerfil.addEventListener('change', function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          imgPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  formEditarPerfil.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!usuarioLogadoStr) {
      alert('Nenhum usuário logado.');
      return;
    }

    const usuarioAtual = JSON.parse(usuarioLogadoStr);

    const dadosAtualizados = {
      ...usuarioAtual,
      username: document.getElementById('editUsername').value.trim(),
      email: document.getElementById('editEmail').value.trim(),
      imagem: fotoPerfilContainer.style.display === 'block' ? imgPreview.src : usuarioAtual.imagem || '',
    };

    if (profissionalCampos.style.display === 'block') {
      dadosAtualizados.especialidade = document.getElementById('editEspecialidade').value.trim();
      dadosAtualizados.localizacao = document.getElementById('editLocalizacao').value.trim();
      dadosAtualizados.horario = document.getElementById('editHorario').value.trim();
      dadosAtualizados.telefone = document.getElementById('editTelefone').value.trim();
    } else {
      // Remove campos profissionais para usuário comum, se existirem
      delete dadosAtualizados.especialidade;
      delete dadosAtualizados.localizacao;
      delete dadosAtualizados.horario;
      delete dadosAtualizados.telefone;
    }

    if (!dadosAtualizados.id) {
      alert('Usuário sem ID, não é possível atualizar no servidor.');
      return;
    }

    try {
      const apiUrlBase = dadosAtualizados.especialidade ? 'http://localhost:3000/profissionais' : 'http://localhost:3000/comum';

      const response = await fetch(`${apiUrlBase}/${dadosAtualizados.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!response.ok) throw new Error('Erro ao atualizar perfil.');

      localStorage.setItem('usuarioLogado', JSON.stringify(dadosAtualizados));
      alert('Perfil atualizado com sucesso!');
      location.reload();

    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar o perfil, tente novamente.');
    }
  });

  btnExcluirConta.addEventListener('click', async function () {
    if (!confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.')) return;

    try {
      if (!usuarioLogadoStr) throw new Error('Nenhum usuário logado.');

      const usuario = JSON.parse(usuarioLogadoStr);
      const apiUrlBase = usuario.especialidade ? 'http://localhost:3000/profissionais' : 'http://localhost:3000/comum';

      if (!usuario.id) throw new Error('Usuário sem ID.');

      const response = await fetch(`${apiUrlBase}/${usuario.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir conta.');

      alert('Conta excluída com sucesso.');
      localStorage.removeItem('usuarioLogado');
      window.location.href = '../index.html';

    } catch (error) {
      console.error(error);
      alert('Erro ao excluir conta, tente novamente.');
    }
  });

});
