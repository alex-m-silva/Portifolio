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
| `js/analytics.js` | GA4 `G-5P9ZC1D2DD` com Consent Mode v2 e aviso de cookies; gtag.js só carrega após "Aceitar" e só no domínio oficial |
| `css/style.css` | todo o visual; tokens em `:root`, tema claro em `[data-tema="claro"]` |
| `vercel.json` | build, `dist/`, cabeçalhos e cache |

## Pendências (em ordem)
1. **Sugestões da avaliação (2026-10-10), dependem do usuário**:
   - Currículo em PDF para baixar (pt e en): recrutador costuma pedir; não existe arquivo no repo.
   - Reconsiderar a proteção contra cópia: impede recrutador de copiar nome/empresa/trechos e
     atrapalha quem seleciona texto para ler; hoje é decisão do usuário (ver "Fatos já decididos").
   - Dizer se está aberto a propostas/freelas (uma linha no topo ou no contato).
   - Desempenho: o maior custo é JS da página inicial (main.js 77 KB + data.js 48 KB sem compactar,
     grafo em canvas e digitação); compactar os JS no build é o próximo passo se quiser subir o Lighthouse.
2. Revisar com o usuário e publicar os 2 rascunhos em `artigos/` (`rascunho: false`).
3. Do lado do usuário: criar o serviço do pdf-para-epub no Render (`render.yaml` pronto no repo
   `alex-m-silva/pdf-para-epub`); Search Console já cadastrado.

## Fatos já decididos
- Repositórios GestaoComercial, ProjetoOficina, CriadorInstalador e LionFinance são privados
  (no site aparecem como "privado", sem link de código). GestaoModa também é privado.
- Endereço sem `#` na barra (links internos interceptados por `irPara`); `#demo-gestaocomercial` abre a demo.
- Texto do site protegido contra cópia (exceto campos, código dos artigos e botões de copiar).
- FormSubmit usa o código apelido `formsubmitId` (ativado para o www).
- Cookies/LGPD (feito em 2026-10-10): tudo negado por padrão; "Aceitar" libera só `analytics_storage` (ad_* sempre negados)
  e só então baixa o gtag.js (modo básico: quem recusa não envia nada ao Google). Escolha em `localStorage.consentimento`;
  recusar depois de aceitar apaga os cookies `_ga*`. Página `/privacidade` (e `/en/privacidade`) gerada em `paginaPrivacidade()`
  no build, com botão `data-consentimento` para rever a escolha. O aviso de idioma espera a escolha de cookies (um aviso por vez).
- Avaliação (feita em 2026-10-10): topo ganhou a linha fixa do cargo (`htmlCargo`, empresa atual e cidade);
  "Quem sou eu" abre com 3 resultados com número (`perfil.resultados` no data.js, `htmlResultados` no build);
  "mais de 3 anos" virou "4 anos" em todo lugar, batendo com o contador "4+" (48 meses somando os empregos).
- Desempenho: Lighthouse ~84-87, SEO/Acessibilidade/Boas práticas 100.

## Prompt para retomar
"Leia o CLAUDE.md e veja comigo as pendências (sugestões da avaliação e os rascunhos dos artigos).
Teste no navegador, sem erros no console, e faça commit e push."
