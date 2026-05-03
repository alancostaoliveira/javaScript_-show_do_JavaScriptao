export const perguntas = [
  {
    enunciado: 'Qual é o maior planeta do sistema solar?',
    alternativas: ['Júpiter', 'Saturno', 'Urano', 'Netuno'],
    resposta: 0,
  },
  {
    enunciado: 'Qual é o menor planeta do sistema solar?',
    alternativas: ['Mercúrio', 'Vênus', 'Marte', 'Plutão'],
    resposta: 0,
  },
  {
    enunciado: 'Qual linguagem roda nativamente no navegador?',
    alternativas: ['Java', 'Python', 'JavaScript', 'C++'],
    resposta: 2,
  },
  {
    enunciado: 'Qual método transforma JSON em objeto?',
    alternativas: [
      'JSON.parse()',
      'JSON.stringify()',
      'Object.create()',
      'Array.from()',
    ],
    resposta: 0,
  },
  {
    enunciado: 'Qual palavra-chave cria uma variável com escopo de bloco?',
    alternativas: ['var', 'let', 'const', 'static'],
    resposta: 1,
  },
  {
    enunciado: 'Qual método adiciona um item ao final de um array?',
    alternativas: ['push()', 'pop()', 'shift()', 'slice()'],
    resposta: 0,
  },
  {
    enunciado: 'O que o método map() faz?',
    alternativas: [
      'Remove itens',
      'Cria uma cópia mutável',
      'Gera um novo array transformado',
      'Ordena em ordem alfabética',
    ],
    resposta: 2,
  },
  {
    enunciado: 'Qual operador compara valor e tipo ao mesmo tempo?',
    alternativas: ['==', '=', '===', '!='],
    resposta: 2,
  },
];

export const tabelaPontuacao = [
  { acertar: 'R$ 1 mil', parar: 'R$ 0', errar: 'R$ 0' },
  { acertar: 'R$ 2 mil', parar: 'R$ 1 mil', errar: 'R$ 500' },
  { acertar: 'R$ 3 mil', parar: 'R$ 2 mil', errar: 'R$ 1 mil' },
  { acertar: 'R$ 5 mil', parar: 'R$ 3 mil', errar: 'R$ 1.500' },
  { acertar: 'R$ 10 mil', parar: 'R$ 5 mil', errar: 'R$ 2 mil' },
  { acertar: 'R$ 20 mil', parar: 'R$ 10 mil', errar: 'R$ 5 mil' },
  { acertar: 'R$ 50 mil', parar: 'R$ 20 mil', errar: 'R$ 10 mil' },
  { acertar: 'R$ 100 mil', parar: 'R$ 50 mil', errar: 'R$ 0' },
];
