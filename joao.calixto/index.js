document.addEventListener('DOMContentLoaded', function () {
  const btnSalvar = document.getElementById('btnSalvar');

  if (btnSalvar) {
    btnSalvar.addEventListener('click', function () {
      const nomeLocal = document.getElementById('nomeLocal').value;
      const bairro = document.getElementById('bairro').value;
      const rua = document.getElementById('rua').value;
      const numero = document.getElementById('numero').value;
      const referencia = document.getElementById('referencia').value;

      const ponto = { nomeLocal, bairro, rua, numero, referencia };

      let pontos = JSON.parse(localStorage.getItem('pontosAcessiveis')) || [];

      pontos.push(ponto);

      localStorage.setItem('pontosAcessiveis', JSON.stringify(pontos));

      
      window.location.href = 'teste.html';
    });
  }

  
  const lista = document.getElementById('listaPontos');

  if (lista) {
    const pontos = JSON.parse(localStorage.getItem('pontosAcessiveis')) || [];

    pontos.forEach((ponto) => {
      const card = document.createElement('div');
      card.className = 'col-12 col-md-6';

      card.innerHTML = `
        <div class="card shadow-sm p-3">
          <h5>${ponto.nomeLocal}</h5>
          <p><strong>Bairro:</strong> ${ponto.bairro}</p>
          <p><strong>Rua:</strong> ${ponto.rua}, ${ponto.numero}</p>
          <p><strong>Referência:</strong> ${ponto.referencia || 'Nenhuma'}</p>
        </div>
      `;

      lista.appendChild(card);
    });
  }
});