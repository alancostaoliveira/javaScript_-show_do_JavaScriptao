import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Porta padrão do servidor local, com possibilidade de sobrescrever via PORT.
const port = Number(process.env.PORT || 8000);
// Raiz do projeto usada para servir arquivos estáticos com segurança.
const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

// Mapeamento simples de extensões para Content-Type.
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

// Servidor mínimo para desenvolvimento local do quiz.
const server = http.createServer(async (request, response) => {
  // A raiz do projeto responde com `index.html` para facilitar o uso no navegador.
  const requestPath =
    request.url === '/' ? '/index.html' : request.url || '/index.html';
  const filePath = path.join(rootDir, decodeURIComponent(requestPath));
  const extension = path.extname(filePath).toLowerCase();

  // Bloqueia tentativas de sair da pasta do projeto via path traversal.
  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Acesso negado.');
    return;
  }

  try {
    // Faz o streaming do arquivo solicitado sem transformar a app em dependência de framework.
    const fileContent = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    });
    response.end(fileContent);
  } catch {
    // Qualquer falha de leitura volta como 404 para manter o comportamento previsível.
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Arquivo não encontrado.');
  }
});

// Inicia o servidor local.
server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
