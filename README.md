# Show do JavaScriptão

Pequeno quiz interativo inspirado no "Show do Milhão" para treinar JavaScript.

Estrutura do projeto

- `index.html` — página principal.
- `css/styles.css` — estilos principais.
- `js/data.js` — perguntas e tabela de pontuação (módulo exportado).
- `js/script.js` — lógica do jogo (módulo ES).

Como executar

Opções simples para testar localmente:

1. Abrir `index.html` diretamente no navegador (adequado para testes rápidos).

2. Usar o servidor local do projeto:

```bash
npm run serve
# depois abra http://localhost:8000
```

3. Servir via Python (alternativa útil se preferir):

```bash
# Python 3
python -m http.server 8000
# depois abra http://localhost:8000
```

Notas

- O `js/script.js` usa `type="module"`, portanto servir via servidor local evita problemas de CORS/import.
- Para desenvolvimento no VS Code, a extensão "Live Server" é uma opção prática.

Scripts disponíveis

- `npm run serve` — sobe o servidor local em Node na porta `8000`.
- `npm run lint` — verifica o código com ESLint.
- `npm run lint:fix` — corrige o que for possível com ESLint.
- `npm run format` — formata o projeto com Prettier.
- `npm run format:check` — valida se a formatação está correta.

Ferramentas de qualidade

- ESLint para regras e detecção de erros em JavaScript.
- Prettier para padronizar a formatação dos arquivos.

O que está implementado

- Renderização dinâmica de perguntas e alternativas.
- Controle de estado simples com embaralhamento de perguntas.
- Ações: confirmar resposta, parar (garante prêmio mínimo) e reiniciar.
- Persistência básica usando `localStorage`: o app salva progresso e o melhor prêmio alcançado (retoma a sessão ao reabrir).

Próximos passos sugeridos

- Adicionar persistência de placar (localStorage).
- Melhorar animações e feedbacks (sons, transições).
- Incluir temporizador por pergunta.
- Melhorar animações e feedbacks (sons, transições).
- Incluir temporizador por pergunta.

Observação: a persistência já está implementada via `localStorage`. Use o botão "Jogar novamente" para reiniciar a sessão (isso limpa o snapshot salvo). Para limpar manualmente, remova as chaves `show_js_estado` e `show_js_melhor_indice` no DevTools (Application → Local Storage).
Uma interface está disponível para limpar o progresso salvo diretamente na aplicação:

- Botão: **Limpar progresso** — localizado no painel lateral (Resultado). Remove o snapshot salvo e o melhor prêmio gravado.
- Feedback: ao limpar, a aplicação exibe uma notificação breve (toast) no rodapé confirmando a ação.

Se preferir, limpe os dados manualmente pelo DevTools conforme citado acima.

---

Se quiser, eu gero um `package.json` com um script `serve` e configuro ESLint/Prettier.
