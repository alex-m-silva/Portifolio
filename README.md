# Portfólio · Alex Matias

Site pessoal com um conceito próprio: **o portfólio é um repositório git**.

- **Início**: um *commit graph* animado (como o `git log --graph`), com ramos que nascem e voltam para a `main`. Os nós reagem ao mouse.
- **Sobre**: escrito como um `git show`, com a stack em forma de *diff* (`+ C#`, `+ .NET 8`…).
- **Experiência**: um `git log` da carreira, em que cada emprego é um commit, seguido da formação.
- **Certificados**: cada certificado é uma *tag* de versão (`v1.0.0`, `v1.1.0`…), com filtro por categoria.
- **Projetos**: cartões de repositório com barra de linguagens, filtro por tecnologia e README em janela.
- **Contato**: o formulário é um *pull request*, com "checks" que passam conforme os campos são preenchidos.
- Trilho lateral que mostra cada seção como um commit no ramo, paleta de comandos (**Ctrl+K** ou **/**), tema claro e escuro e layout para celular.

HTML, CSS e JavaScript puros: sem framework, sem build e sem dependências.

## Como editar

Todo o conteúdo fica em [`js/data.js`](js/data.js):

| Campo | O que preencher |
|---|---|
| `perfil` | nome, frases do topo, texto do "sobre" e stack |
| `contato` | `email`, `github`, `linkedin`, `instagram`, `whatsapp` (só números, com DDI e DDD). Campo vazio esconde o canal |
| `experiencia` | `cargo`, `empresa`, `inicio` e `fim` (`"AAAA-MM"`, `fim` vazio = emprego atual), `local`, `resumo`, `destaques` e `stack` |
| `formacao` | `curso`, `instituicao`, `inicio` e `fim` |
| `certificados` | `titulo`, `emissor`, `data` de conclusão (`"AAAA-MM"`), `categoria` (vira o filtro), `skills` e `url` de verificação |
| `projetos` | `nome`, `resumo`, `detalhes`, `tags`, `linguagens` (%), `repo`, `demo` e `destaque` |

Um certificado com `exemplo: true` aparece com um selo "exemplo"; sem `url`, aparece como "link em breve".

O formulário de contato abre o aplicativo de e-mail do visitante com o assunto e a mensagem já preenchidos, então só funciona depois de configurar o `email`.

## Rodar localmente

Abra o `index.html` no navegador, ou sirva a pasta:

```bash
python -m http.server 5510
```

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie este projeto.
2. Em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
