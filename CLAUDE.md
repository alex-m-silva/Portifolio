# Portfólio · Alex Matias (contexto para novas sessões)

Site pessoal em HTML/CSS/JS puros, sem framework, publicado no Vercel em https://www.alexmatias.dev.br (o domínio sem www redireciona 308 para o www). Conceito: "o portfólio é um repositório git".

## Como funciona
- Conteúdo: `js/data.js`. Textos bilíngues com `L("pt", "en")`.
- Idiomas: `js/i18n.js` (dicionário EN, `t()`, `resolver()`, datas, aviso de idioma e preferência em localStorage). Português em `/`, inglês em `/en` (sem barra no fim).
- Build: `node tools/build.js` (o Vercel roda a cada push, gera `dist/`). Pré-renderiza o conteúdo no HTML, gera `/projetos/<slug>` e `/en/projetos/<slug>`, artigos (`artigos/*.md`, só pt, `rascunho: true` não publica), sitemap bilíngue, robots, CSS compactado e `?v=hash`. Falha se faltar tradução (`tools/checar-traducoes.js`).
- Textos fixos do `index.html` marcados com `data-t` / `data-ta`; o build traduz para o inglês.
- Testar local: `node tools/build.js && node tools/servidor.js` → http://localhost:5510.
- Imagens (OG, ícones, favicon): `bash tools/gerar-imagens.sh`.

## Regras do usuário
- Commits sem Co-Authored-By. Mensagens em português.
- Console sem erros; testar desktop e celular antes de publicar.
- Usuário fala português; respostas em português.

## Pendências
- Cookies/LGPD: o GA4 (`js/analytics.js`) usa cookies. Avaliar banner de consentimento com Consent Mode v2 (pt/en).
- Avaliação do portfólio pedida pelo usuário (UX/conteúdo para recrutador).
- Revisar e publicar os 2 rascunhos em `artigos/`.
- Repositórios GestaoComercial, ProjetoOficina, CriadorInstalador e LionFinance são privados (aparecem como "privado").
- pdf-para-epub: API no Render ainda depende do usuário criar o serviço (render.yaml pronto).
