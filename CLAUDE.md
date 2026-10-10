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

## Arquivos principais
| Arquivo | Papel |
|---|---|
| `index.html` | modelo da página inicial; marcadores `<!--pre:nome-->` preenchidos pelo build |
| `js/main.js` | comportamento da página inicial (grafo animado, cards, filtros, paleta Ctrl+K, contato via FormSubmit, galeria) |
| `js/pagina.js` | comportamento das páginas internas (projetos/artigos) |
| `js/tema.js` | tema salvo + animação de entrada do topo (só na inicial) |
| `js/analytics.js` | GA4 `G-5P9ZC1D2DD`, só no domínio oficial |
| `css/style.css` | todo o visual; tokens em `:root`, tema claro em `[data-tema="claro"]` |
| `vercel.json` | build, `dist/`, cabeçalhos e cache |

## Pendências (em ordem)
1. **Cookies / LGPD** (pedido do usuário, ainda não feito). O GA4 grava cookies `_ga`.
   Plano: aviso discreto no estilo do site (git), pt/en via `js/i18n.js`, com "Aceitar" e "Recusar";
   Google Consent Mode v2 em `js/analytics.js` (`gtag('consent','default',{analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'})`,
   e `update` para `granted` ao aceitar); escolha em localStorage; link "privacidade" no rodapé
   com uma página curta (`/privacidade` e `/en/privacidade`, gerada pelo build) explicando GA4,
   FormSubmit e localStorage (tema/idioma). Testar console limpo, celular e os dois idiomas.
2. **Avaliação do portfólio** (pedido do usuário): análise honesta para recrutador/cliente
   (primeira impressão, clareza do que ele faz, provas de resultado, CTA, acessibilidade,
   desempenho) e propor/implementar melhorias.
3. Revisar com o usuário e publicar os 2 rascunhos em `artigos/` (`rascunho: false`).
4. Do lado do usuário: criar o serviço do pdf-para-epub no Render (`render.yaml` pronto no repo
   `alex-m-silva/pdf-para-epub`); Search Console já cadastrado.

## Fatos já decididos
- Repositórios GestaoComercial, ProjetoOficina, CriadorInstalador e LionFinance são privados
  (no site aparecem como "privado", sem link de código). GestaoModa também é privado.
- Endereço sem `#` na barra (links internos interceptados por `irPara`); `#demo-gestaocomercial` abre a demo.
- Texto do site protegido contra cópia (exceto campos, código dos artigos e botões de copiar).
- FormSubmit usa o código apelido `formsubmitId` (ativado para o www).
- Desempenho: Lighthouse ~84-87, SEO/Acessibilidade/Boas práticas 100.

## Prompt para retomar
"Leia o CLAUDE.md e faça a pendência 1 (cookies/LGPD com Consent Mode e página de privacidade),
depois a 2 (avaliação do portfólio). Teste no navegador, sem erros no console, e faça commit e push."
