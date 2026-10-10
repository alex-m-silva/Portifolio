# Portfólio · Alex Matias

Site pessoal com um conceito próprio: **o portfólio é um repositório git**.

- **Início**: um *commit graph* animado (como o `git log --graph`), com ramos que nascem e voltam para a `main`. Os nós reagem ao mouse.
- **Sobre**: escrito como um `git show`, com a stack em forma de *diff* (`+ C#`, `+ .NET 8`…).
- **Experiência**: um `git log` da carreira, em que cada emprego é um commit, seguido da formação.
- **Certificados**: cada certificado é uma *tag* de versão (`v1.0.0`, `v1.1.0`…), com filtro por categoria.
- **Projetos**: cartões de repositório com barra de linguagens, filtro por tecnologia e README em janela.
- **Contato**: o formulário é um *pull request*, com "checks" que passam conforme os campos são preenchidos, uma janela para revisar antes de enviar e a confirmação de envio ("PR merged").
- Trilho lateral clicável: cada seção é um commit no ramo, e clicar num ponto leva até ela.
- Paleta de comandos (**Ctrl+K** ou **/**), tema claro e escuro e layout para celular.
- Texto protegido contra seleção e cópia (os campos do formulário continuam normais; o e-mail se copia pelo botão "copiar email").
- Um recado para quem abre o console do navegador, com os links de contato e o comando `vamosConversar()`.

HTML, CSS e JavaScript puros: sem framework, sem build e sem dependências.

## Como editar

Todo o conteúdo fica em [`js/data.js`](js/data.js):

| Campo | O que preencher |
|---|---|
| `perfil` | nome, frases do topo, texto do "sobre" e stack |
| `contato` | `email`, `github`, `linkedin`, `instagram`, `whatsapp` (só números, com DDI e DDD), `whatsappMensagem` (texto que já vem escrito ao abrir o WhatsApp). Campo vazio esconde o canal |
| `experiencia` | `cargo`, `empresa`, `inicio` e `fim` (`"AAAA-MM"`, `fim` vazio = emprego atual), `local`, `resumo`, `destaques` e `stack` |
| `formacao` | `curso`, `instituicao`, `inicio` e `fim` |
| `certificados` | `titulo`, `emissor`, `data` de conclusão (`"AAAA-MM"`), `categoria` (vira o filtro), `skills` e `url` de verificação |
| `projetos` | `nome`, `resumo`, `detalhes`, `tags`, `linguagens` (%), `repo`, `demo` e `destaque` |
| `projetos[].apresentacao` | opcional: `pasta`, `video`, `capa`, `intro` e `telas` (`arquivo`, `titulo`, `texto`). Mostra o vídeo (toca sozinho, sem som) e o tour pelas telas na janela do README, e o botão "demo" no card. As telas abrem ampliadas numa galeria. A pasta tem `telas/<arquivo>.jpg` (1920×1080, a ampliada) e `telas/mini/<arquivo>.jpg` (720px, a miniatura). Link direto: `/#demo-<nome do projeto>` |

Um certificado com `exemplo: true` aparece com um selo "exemplo"; sem `url`, aparece como "link em breve".

O formulário de contato envia a mensagem direto para o `email` configurado, via [FormSubmit](https://formsubmit.co) (sem cadastro). Na primeira mensagem o FormSubmit manda um e-mail de ativação para esse endereço: é só clicar no link uma vez. Se o envio falhar, a janela oferece tentar de novo ou enviar pelo aplicativo de e-mail do visitante.

## SEO (tráfego orgânico)

- Título, descrição, `canonical` e `robots` no `<head>`.
- Open Graph e Twitter Card com a imagem [`assets/og-image.png`](assets/og-image.png) (1200×630), para o link aparecer com prévia no LinkedIn e no WhatsApp.
- Dados estruturados (JSON-LD `ProfilePage` + `Person`) com cargo, empresa, formação, cidade, habilidades e redes.
- [`robots.txt`](robots.txt), [`sitemap.xml`](sitemap.xml), [`site.webmanifest`](site.webmanifest), ícones do app e `favicon.ico`.
- Página [`404.html`](404.html) com status 404 de verdade (o Vercel serve sozinho).

Ao mudar cargo, empresa ou habilidades em `js/data.js`, atualize também o JSON-LD e as metatags do `index.html`, e a data em `sitemap.xml`.

**Depois de publicar:** cadastre o site no [Google Search Console](https://search.google.com/search-console) e no [Bing Webmaster Tools](https://www.bing.com/webmasters), envie o `sitemap.xml` e coloque o link do site no LinkedIn, no GitHub (perfil e README) e no Instagram. Esses links são o que mais ajuda o Google a achar e confiar no site.

## Imagens

A imagem de compartilhamento e os ícones são gerados a partir dos modelos em [`tools/`](tools) com o Chrome em modo headless:

```bash
bash tools/gerar-imagens.sh
```

A pasta `tools/` não vai para o ar (está no `.vercelignore` e bloqueada no `robots.txt`).

## Rodar localmente

Sirva a pasta (abrindo o `index.html` direto pelo arquivo, o manifest não carrega):

```bash
python -m http.server 5510
```

## Publicação

O site está no Vercel, em [www.alexmatias.dev.br](https://www.alexmatias.dev.br) (o domínio sem `www` redireciona para ele). Cada push na `main` publica. O [`vercel.json`](vercel.json) define cabeçalhos de segurança e de cache.
