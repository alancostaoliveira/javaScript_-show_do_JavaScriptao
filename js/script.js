/**
 * js/script.js
 * Lógica do quiz: renderização, estado e controle de fluxo.
 * - Importa `perguntas` e `tabelaPontuacao` de `js/data.js`.
 * - Mantém um `estado` local simples para controlar o fluxo do jogo.
 */
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

/**
 * Estado local da aplicação.
 * @typedef {Object} Estado
 * @property {Array} embaralhadas - perguntas embaralhadas para a sessão
 * @property {number} indiceAtual - índice da pergunta atual (0-based)
 * @property {number|null} selecionada - alternativa selecionada (0-based) ou null
 * @property {string} pontuacao - prêmio exibido ao usuário
 * @property {boolean} encerrado - quando true bloqueia interações
 */

/** @type {Estado} */
const estado = {
  embaralhadas: embaralhaPerguntas(perguntas), // perguntas embaralhadas
  indiceAtual: 0,
  selecionada: null,
  pontuacao: tabelaPontuacao[0].parar,
  encerrado: false,
};

/* Embaralhador (Fisher–Yates simplificado via sort):
   usado para variar a ordem das perguntas em cada rodada.
*/
/**
 * Embaralha uma lista de perguntas e retorna uma nova array.
 * @param {Array} lista - array de perguntas
 * @returns {Array} - nova array embaralhada
 */
function embaralhaPerguntas(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

// Retorna o valor do prêmio para o índice informado
/**
 * Retorna o valor do prêmio associado a um índice de rodada.
 * @param {number} indice
 * @returns {string}
 */
function formataPremio(indice) {
  return tabelaPontuacao[Math.min(indice, tabelaPontuacao.length - 1)].acertar;
}

// Atualiza a lista lateral de premiações (tabela de pontuação)
/**
 * Atualiza a lista lateral de premiações (tabela de pontuação).
 * Não retorna valor; atualiza o DOM em `tabelaLista`.
 */
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

// Atualiza indicadores visuais: rodada, prêmio e progresso
/**
 * Atualiza indicadores visuais: rodada atual, prêmio e progresso.
 */
function atualizaIndicadores() {
  rodadaAtual.textContent = String(
    Math.min(estado.indiceAtual + 1, perguntas.length),
  );
  premioAtual.textContent = estado.pontuacao;
  progress.textContent = `Pergunta ${Math.min(estado.indiceAtual + 1, perguntas.length)} de ${perguntas.length}`;
}

// Limpa a seleção atual do usuário e desabilita o botão de confirmar
/**
 * Limpa a seleção atual do usuário e desabilita o botão de confirmação.
 */
function limpaSelecao() {
  document.querySelectorAll('.alternativa').forEach((botao) => {
    botao.classList.remove('selecionada');
  });
  estado.selecionada = null;
  btnConfirmar.disabled = true;
}

// Define fim do jogo e atualiza a UI com a mensagem final
/**
 * Finaliza o jogo: bloqueia interações e exibe a mensagem final.
 * @param {string} texto - mensagem a ser exibida no fim
 */
function encerraJogo(texto) {
  estado.encerrado = true;
  btnConfirmar.disabled = true;
  btnParar.disabled = true;
  btnReiniciar.hidden = false;
  mensagem.textContent = texto;
}

/* Renderiza a pergunta atual: enunciado e botões de alternativas.
   - Cria elementos dinamicamente e adiciona handlers de clique.
*/
/**
 * Renderiza a pergunta atual no DOM: cria botões de alternativa e handlers.
 * Se não houver mais perguntas, encerra o jogo.
 */
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

    // Ao clicar em uma alternativa: marcar seleção e habilitar confirmação
    // Ao clicar em uma alternativa: marcar seleção e habilitar confirmação
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

  // Pós-render: garantir que os indicadores estejam sincronizados
  // Pós-render: garantir que os indicadores estejam sincronizados
  limpaSelecao();
  atualizaIndicadores();
  atualizaTabela();
  mensagem.textContent = 'Escolha uma alternativa para continuar.';
}

/* Verifica a resposta selecionada, atualiza pontuação e avança/encerra.
   - Se correta: atualiza prêmio e passa à próxima pergunta.
   - Se errada: encerra o jogo com prêmio de insegurança (errado).
*/
/**
 * Valida a resposta selecionada pelo usuário.
 * - Atualiza pontuação em caso de acerto.
 * - Encerra o jogo em caso de erro.
 */
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

  // Resposta errada: define pontuação do erro e encerra
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

// Reinicia o estado do jogo para jogar novamente
/**
 * Reinicia o estado do jogo para iniciar uma nova sessão.
 */
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

// Parar o jogo: jogador decide encerrar mantendo prêmio de "parar"
/**
 * O jogador decide parar: encerra o jogo mantendo o prêmio de "parar".
 */
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
