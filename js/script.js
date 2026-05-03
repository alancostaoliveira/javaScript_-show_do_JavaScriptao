import { perguntas, tabelaPontuacao } from './data.js';

const enunciado = document.getElementById('enunciado');
const alternativasContainer = document.getElementById('alternativas');
const btnConfirmar = document.getElementById('btnConfirmar');
const btnParar = document.getElementById('btnParar');
const btnReiniciar = document.getElementById('btnReiniciar');
const mensagem = document.getElementById('mensagem');
const rodadaAtual = document.getElementById('rodadaAtual');
const premioAtual = document.getElementById('premioAtual');
const progress = document.getElementById('progress');
const tabelaLista = document.getElementById('tabelaPontuacao');

const estado = {
  embaralhadas: embaralhaPerguntas(perguntas),
  indiceAtual: 0,
  selecionada: null,
  pontuacao: tabelaPontuacao[0].parar,
  encerrado: false,
};

function embaralhaPerguntas(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

function formataPremio(indice) {
  return tabelaPontuacao[Math.min(indice, tabelaPontuacao.length - 1)].acertar;
}

function atualizaTabela() {
  tabelaLista.innerHTML = '';

  tabelaPontuacao.forEach((item, indice) => {
    const linha = document.createElement('li');
    linha.dataset.active = String(indice === estado.indiceAtual);
    linha.innerHTML = `
      <span>${indice + 1}</span>
      <span class="valor">${item.acertar}</span>
    `;
    tabelaLista.appendChild(linha);
  });
}

function atualizaIndicadores() {
  rodadaAtual.textContent = String(
    Math.min(estado.indiceAtual + 1, perguntas.length),
  );
  premioAtual.textContent = estado.pontuacao;
  progress.textContent = `Pergunta ${Math.min(estado.indiceAtual + 1, perguntas.length)} de ${perguntas.length}`;
}

function limpaSelecao() {
  document.querySelectorAll('.alternativa').forEach((botao) => {
    botao.classList.remove('selecionada');
  });
  estado.selecionada = null;
  btnConfirmar.disabled = true;
}

function encerraJogo(texto) {
  estado.encerrado = true;
  btnConfirmar.disabled = true;
  btnParar.disabled = true;
  btnReiniciar.hidden = false;
  mensagem.textContent = texto;
}

function renderizaPergunta() {
  if (estado.indiceAtual >= estado.embaralhadas.length) {
    encerraJogo(`Você concluiu o quiz com ${estado.pontuacao}.`);
    return;
  }

  const pergunta = estado.embaralhadas[estado.indiceAtual];
  enunciado.textContent = pergunta.enunciado;
  alternativasContainer.innerHTML = '';

  pergunta.alternativas.forEach((alternativa, indice) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'alternativa';
    botao.dataset.index = String(indice);
    botao.dataset.letter = String.fromCharCode(65 + indice);
    botao.setAttribute('role', 'listitem');
    botao.textContent = alternativa;

    botao.addEventListener('click', () => {
      if (estado.encerrado) {
        return;
      }

      document.querySelectorAll('.alternativa').forEach((item) => {
        item.classList.remove('selecionada');
      });

      botao.classList.add('selecionada');
      estado.selecionada = indice;
      btnConfirmar.disabled = false;
      mensagem.textContent = `Alternativa ${botao.dataset.letter} selecionada.`;
    });

    alternativasContainer.appendChild(botao);
  });

  limpaSelecao();
  atualizaIndicadores();
  atualizaTabela();
  mensagem.textContent = 'Escolha uma alternativa para continuar.';
}

function confirmaResposta() {
  if (estado.encerrado || estado.selecionada === null) {
    return;
  }

  const pergunta = estado.embaralhadas[estado.indiceAtual];
  const acertou = estado.selecionada === pergunta.resposta;
  const respostaCorreta = pergunta.alternativas[pergunta.resposta];

  if (acertou) {
    estado.pontuacao = formataPremio(estado.indiceAtual);
    mensagem.textContent = `Correto. A resposta era ${respostaCorreta}.`;
    estado.indiceAtual += 1;

    if (estado.indiceAtual >= estado.embaralhadas.length) {
      setTimeout(
        () => encerraJogo(`Você venceu com ${estado.pontuacao}.`),
        900,
      );
      return;
    }

    setTimeout(() => {
      renderizaPergunta();
    }, 900);
    return;
  }

  estado.pontuacao =
    tabelaPontuacao[
      Math.min(estado.indiceAtual, tabelaPontuacao.length - 1)
    ].errar;
  mensagem.textContent = `Errado. A resposta certa era ${respostaCorreta}.`;
  setTimeout(
    () => encerraJogo(`Fim de jogo. Você levou ${estado.pontuacao}.`),
    900,
  );
}

function reiniciaJogo() {
  estado.embaralhadas = embaralhaPerguntas(perguntas);
  estado.indiceAtual = 0;
  estado.selecionada = null;
  estado.pontuacao = tabelaPontuacao[0].parar;
  estado.encerrado = false;

  btnParar.disabled = false;
  btnReiniciar.hidden = true;
  renderizaPergunta();
}

function pararJogo() {
  if (estado.encerrado) {
    return;
  }

  estado.pontuacao =
    tabelaPontuacao[
      Math.min(estado.indiceAtual, tabelaPontuacao.length - 1)
    ].parar;
  encerraJogo(`Você parou com ${estado.pontuacao}.`);
}

btnConfirmar.addEventListener('click', confirmaResposta);
btnParar.addEventListener('click', pararJogo);
btnReiniciar.addEventListener('click', reiniciaJogo);

renderizaPergunta();
