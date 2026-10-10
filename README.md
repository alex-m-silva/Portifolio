# Portfólio · Alex Matias

Site pessoal com um conceito próprio: **o portfólio é um repositório git**.

- **Início**: um *commit graph* animado (como o `git log --graph`), com ramos que nascem e voltam para a `main`. Os nós reagem ao mouse.
- **Sobre**: escrito como um `git show`, com a stack em forma de *diff* (`+ C#`, `+ .NET 8`…) e o grafo da carreira.
- **Experiência**: um `git log` da carreira, em que cada emprego é um commit, seguido da formação.
- **Certificados**: cada certificado é uma *tag* de versão (`v1.0.0`, `v1.1.0`…), com filtro por categoria.
- **Projetos**: cartões de repositório com barra de linguagens, filtro por tecnologia, README em janela e uma **página própria por projeto**.
- **Artigos**: textos técnicos em Markdown, publicados em `/artigos`.
- **Contato**: o formulário é um *pull request*, com "checks" que passam conforme os campos são preenchidos, uma janela para revisar antes de enviar e a confirmação de envio ("PR merged").
- Trilho lateral clicável, paleta de comandos (**Ctrl+K** ou **/**), tema claro e escuro, layout para celular e endereço sem `#`.
- Texto protegido contra seleção e cópia (os campos do formulário e o código dos artigos continuam normais).
- Um recado para quem abre o console do navegador, com os links de contato e o comando `vamosConversar()`.

HTML, CSS e JavaScript puros, sem framework e sem dependências. Um script de build em Node ([`tools/build.js`](tools/build.js)) gera o site final.

## Como funciona o build

O Vercel roda `node tools/build.js` a cada push e publica a pasta `dist/` (veja o [`vercel.json`](vercel.json)). O build:

1. grava no `index.html` o conteúdo que antes só aparecia pelo JavaScript (sobre, stack, experiência, formação, certificados e projetos), entre os marcadores `<!--pre:...-->`. O Google lê tudo direto do HTML; no navegador, o `main.js` monta de novo por cima, com as animações e os filtros;
2. gera uma página para cada projeto em `/projetos/<slug>`, com título e descrição para busca, texto, vídeo, galeria de telas, imagem de compartilhamento própria, dados estruturados e links para os outros projetos;
3. gera os artigos de `artigos/*.md` em `/artigos/<slug>` e a lista em `/artigos`;
4. gera o `sitemap.xml` (com todas as páginas e as imagens das telas) e o `robots.txt`.

Você continua editando só o `js/data.js` (e os artigos). Não precisa rodar o build antes do push.

## Como editar

Todo o conteúdo fica em [`js/data.js`](js/data.js):

| Campo | O que preencher |
|---|---|
| `perfil` | nome, frases do topo, texto do "sobre" e stack |
| `contato` | `email` e `whatsapp` codificados (gere com `node tools/codificar.js "valor"`), `formsubmitId`, `github`, `linkedin`, `instagram`, `whatsappMensagem`. Campo vazio esconde o canal |
| `experiencia` | `cargo`, `empresa`, `inicio` e `fim` (`"AAAA-MM"`, `fim` vazio = emprego atual), `local`, `resumo`, `destaques` e `stack` |
| `formacao` | `curso`, `instituicao`, `inicio` e `fim` |
| `certificados` | `titulo`, `emissor`, `data` de conclusão (`"AAAA-MM"`), `categoria` (vira o filtro), `skills` e `url` de verificação |
| `projetos` | `nome`, `slug` (endereço da página), `resumo`, `seo` (`titulo` até ~60 caracteres, `descricao` até ~155, `categoria` e `sistema` para o Google), `sobre` (texto da página, um parágrafo por item), `detalhes`, `tags`, `linguagens` (%), `repo` (vazio = privado), `demo` e `destaque` |
| `projetos[].apresentacao` | opcional: `pasta`, `video`, `capa`, `intro` e `telas` (`arquivo`, `titulo`, `texto`). Mostra o vídeo e o tour pelas telas, no README em janela e na página do projeto. A pasta tem `telas/<arquivo>.jpg` (1920×1080) e `telas/mini/<arquivo>.jpg` (720px). Link direto para a demo: `/#demo-<nome do projeto>` |

O formulário de contato envia pelo [FormSubmit](https://formsubmit.co) usando o código apelido `formsubmitId`, para o e-mail não aparecer na requisição. A ativação do FormSubmit é por domínio: se o site mudar de endereço, a primeira mensagem dispara um novo e-mail de ativação.

## Artigos

Cada artigo é um arquivo `.md` em [`artigos/`](artigos), com um cabeçalho:

```markdown
---
titulo: Título do artigo
descricao: Resumo de uma ou duas frases (aparece no Google)
data: 2026-10-10
tags: [C#, .NET, Entity Framework]
rascunho: true
---

Texto em Markdown: ## títulos, listas, `código`, blocos ```csharp, **negrito**, [links](https://...), > citações e tabelas.
```

Com `rascunho: true` o artigo **não é publicado**. Para revisar como ele vai ficar:

```bash
node tools/build.js --rascunhos
```

Quando estiver pronto, troque para `rascunho: false` e faça o push. Ele entra no site, no menu, na página inicial e no sitemap.

## Rodar localmente

```bash
node tools/build.js
```

```bash
node tools/servidor.js
```

Abra http://localhost:5510. O servidor imita o Vercel (endereços sem `.html`, cabeçalhos e página 404).

## Imagens

A imagem de compartilhamento do site, a de cada projeto (`assets/og/<slug>.png`) e os ícones são gerados a partir dos modelos em [`tools/`](tools) com o Chrome em modo headless. Rode de novo ao criar um projeto ou mudar o nome, o resumo ou as tags de um:

```bash
bash tools/gerar-imagens.sh
```

## SEO (tráfego orgânico)

- Conteúdo no HTML (build), uma página por projeto e artigos: mais páginas para o Google mostrar em buscas diferentes.
- Título, descrição, `canonical` e `robots` em todas as páginas; Open Graph e Twitter Card com imagem própria.
- Dados estruturados (JSON-LD): `ProfilePage` + `Person` e a lista de projetos na página inicial; `SoftwareApplication`, `SoftwareSourceCode` e `BreadcrumbList` nas páginas de projeto; `TechArticle` nos artigos.
- `sitemap.xml` com as imagens das telas, `robots.txt`, `site.webmanifest`, ícones e página 404 com status 404 de verdade.

Ao mudar cargo, empresa ou habilidades em `js/data.js`, atualize também o JSON-LD `Person` e as metatags no topo do `index.html`.

## Publicação

O site está no Vercel, em [www.alexmatias.dev.br](https://www.alexmatias.dev.br) (o domínio sem `www` redireciona para ele). Cada push na `main` roda o build e publica. Se o build falhar, o Vercel mantém a versão anterior no ar.
