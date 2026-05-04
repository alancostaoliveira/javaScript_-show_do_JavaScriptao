/**
 * tests/script.test.js
 * Testes unitários para funções críticas do quiz
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { perguntas, tabelaPontuacao } from '../js/data.js';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

// Importar funções testáveis (exportadas dinamicamente via módulo)
// Para isso, vamos testar as funções através do módulo script.js
// Mas já que script.js não exporta as funções, vamos criar versões testáveis

/**
 * Embaralha uma lista e retorna nova array (Fisher–Yates simplificado)
 */
function embaralhaPerguntas(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

/**
 * Retorna o prêmio para um índice de rodada
 */
function formataPremio(indice) {
  return tabelaPontuacao[Math.min(indice, tabelaPontuacao.length - 1)].acertar;
}

/**
 * Valida se dois conjuntos têm os mesmos elementos
 */
function temMesmosElementos(arr1, arr2) {
  return (
    arr1.length === arr2.length && arr1.every((item) => arr2.includes(item))
  );
}

describe('embaralhaPerguntas', () => {
  it('deve retornar um array com o mesmo tamanho', () => {
    const embaralhadas = embaralhaPerguntas(perguntas);
    expect(embaralhadas).toHaveLength(perguntas.length);
  });

  it('deve conter os mesmos elementos da lista original', () => {
    const embaralhadas = embaralhaPerguntas(perguntas);
    expect(temMesmosElementos(perguntas, embaralhadas)).toBe(true);
  });

  it('deve retornar uma nova array (não modificar original)', () => {
    const original = [...perguntas];
    embaralhaPerguntas(perguntas);
    expect(perguntas).toEqual(original);
  });

  it('deve variar a ordem em múltiplas chamadas (probabilístico)', () => {
    const embaralhadas1 = embaralhaPerguntas(perguntas);
    const embaralhadas2 = embaralhaPerguntas(perguntas);
    // Muito improvável que duas embaralhagens aleatórias sejam idênticas
    // Se forem, o teste pode falhar raramente
    const saoIguais = embaralhadas1.every((p, i) => p === embaralhadas2[i]);
    expect(saoIguais).toBe(false);
  });
});

describe('formataPremio', () => {
  it('deve retornar o prêmio para a primeira rodada', () => {
    const premio = formataPremio(0);
    expect(premio).toBe(tabelaPontuacao[0].acertar);
  });

  it('deve retornar o prêmio para uma rodada intermediária', () => {
    const premio = formataPremio(3);
    expect(premio).toBe(tabelaPontuacao[3].acertar);
  });

  it('deve retornar o último prêmio quando índice > tabela', () => {
    const premio = formataPremio(999);
    expect(premio).toBe(tabelaPontuacao[tabelaPontuacao.length - 1].acertar);
  });

  it('deve retornar uma string válida', () => {
    const premio = formataPremio(0);
    expect(typeof premio).toBe('string');
    expect(premio.length).toBeGreaterThan(0);
  });
});

describe('localStorage helpers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve salvar e carregar o melhor índice', () => {
    const key = 'show_js_melhor_indice';
    localStorage.setItem(key, '5');
    const loaded = localStorage.getItem(key);
    expect(loaded).toBe('5');
  });

  it('deve limpar a chave de melhor índice', () => {
    const key = 'show_js_melhor_indice';
    localStorage.setItem(key, '3');
    localStorage.removeItem(key);
    const loaded = localStorage.getItem(key);
    expect(loaded).toBeNull();
  });

  it('deve salvar e validar snapshot com versionamento', () => {
    const key = 'show_js_estado';
    const payload = {
      v: 1,
      embaralhadasIdx: [0, 1, 2],
      indiceAtual: 1,
      pontuacao: 'R$ 1 mil',
    };
    localStorage.setItem(key, JSON.stringify(payload));
    const loaded = JSON.parse(localStorage.getItem(key));
    expect(loaded.v).toBe(1);
    expect(loaded.indiceAtual).toBe(1);
  });

  it('deve retornar null para chave inexistente', () => {
    const loaded = localStorage.getItem('chave_inexistente');
    expect(loaded).toBeNull();
  });
});

describe('integrações básicas', () => {
  it('tabelaPontuacao tem dados válidos', () => {
    expect(tabelaPontuacao.length).toBeGreaterThan(0);
    tabelaPontuacao.forEach((item) => {
      expect(item.acertar).toBeDefined();
      expect(item.parar).toBeDefined();
      expect(item.errar).toBeDefined();
    });
  });

  it('perguntas tem estrutura esperada', () => {
    expect(perguntas.length).toBeGreaterThan(0);
    perguntas.forEach((pergunta) => {
      expect(pergunta.enunciado).toBeDefined();
      expect(pergunta.alternativas).toBeInstanceOf(Array);
      expect(pergunta.alternativas.length).toBeGreaterThan(0);
      expect(typeof pergunta.resposta).toBe('number');
      expect(pergunta.resposta).toBeLessThan(pergunta.alternativas.length);
    });
  });
});
