---
titulo: N+1 no Entity Framework: como cortei 25% do tempo de um cálculo em lote
descricao: O que é o problema N+1 no Entity Framework, como encontrá-lo nos logs e as três mudanças que levaram um cálculo de 1.608 registros de 7min20s para 5min30s.
data: 2026-10-10
tags: [C#, .NET, Entity Framework, SQL Server, Performance]
rascunho: true
---

Num ERP de cartório, uma rotina calculava as custas de um lote de títulos. Com 1.608 títulos, ela levava **7 minutos e 20 segundos**. Depois de três mudanças no acesso a dados, passou a levar **5 minutos e 30 segundos**, cerca de 25% a menos, sem mudar nenhuma regra de cálculo.

O culpado principal tinha nome conhecido: o problema **N+1**.

## O que é o N+1

O N+1 acontece quando o código busca uma lista (1 consulta) e, para cada item dela, faz mais uma consulta (N consultas). Com o Entity Framework isso aparece fácil, porque a navegação entre entidades esconde as idas ao banco.

```csharp
// Exemplo simplificado
var titulos = contexto.Titulos.Where(t => t.LoteId == loteId).ToList(); // 1 consulta

foreach (var titulo in titulos)
{
    // Cada acesso abaixo pode virar uma consulta nova (lazy loading)
    var tabela = titulo.TabelaDeCustas;   // +1 por título
    var faixas = tabela.Faixas.ToList();  // +1 por título
    titulo.Custas = Calcular(titulo, faixas);
}
```

Com 1.608 títulos, o que parece "uma consulta" vira milhares. Cada uma é rápida sozinha, mas o tempo de ida e volta ao banco se soma.

## Como encontrar

O primeiro passo é ver o SQL que o Entity Framework está gerando. Duas formas simples:

- **Log do próprio EF:** no EF6, `contexto.Database.Log = s => Debug.Write(s);`; no EF Core, `optionsBuilder.LogTo(Console.WriteLine)`.
- **SQL Server Profiler ou Extended Events:** rodar a rotina com um lote pequeno e contar as consultas repetidas.

O sinal do N+1 é sempre o mesmo: a mesma consulta, com um parâmetro diferente, se repetindo dezenas ou centenas de vezes.

## O que mudou

### 1. Carregar o que vai ser usado junto, de uma vez

Em vez de deixar a navegação buscar sob demanda, a consulta passa a trazer o necessário logo de início, com `Include` ou com uma projeção só dos campos usados.

```csharp
// Exemplo simplificado
var titulos = contexto.Titulos
    .Where(t => t.LoteId == loteId)
    .Include(t => t.TabelaDeCustas.Faixas)
    .AsNoTracking() // só leitura: o EF não precisa acompanhar mudanças
    .ToList();
```

### 2. Dados de referência em memória

Tabelas de custas, faixas e emolumentos mudam pouco e se repetem entre os títulos. Buscar tudo **uma vez** e consultar num dicionário tira essas idas ao banco do laço.

```csharp
// Exemplo simplificado
var faixasPorTabela = contexto.Faixas
    .AsNoTracking()
    .ToList()
    .GroupBy(f => f.TabelaId)
    .ToDictionary(g => g.Key, g => g.ToList());

foreach (var titulo in titulos)
{
    var faixas = faixasPorTabela[titulo.TabelaId]; // memória, sem banco
    titulo.Custas = Calcular(titulo, faixas);
}
```

### 3. Consultas em blocos quando a lista é grande

Quando é preciso buscar registros relacionados a muitos títulos, um `Contains` com todos os IDs resolve em poucas consultas. Para não estourar o limite de parâmetros do SQL Server (2.100), os IDs vão em blocos.

```csharp
// Exemplo simplificado (Chunk existe a partir do .NET 6; no .NET Framework, Skip/Take faz o mesmo)
foreach (var bloco in ids.Chunk(1000))
{
    var registros = contexto.Andamentos
        .Where(a => bloco.Contains(a.TituloId))
        .AsNoTracking()
        .ToList();
    // ...
}
```

## O resultado

| | Antes | Depois |
|---|---|---|
| Tempo para 1.608 títulos | 7min20s | 5min30s |

O resultado de cada cálculo continuou exatamente o mesmo, que era a condição para a mudança entrar. O que caiu foi o número de idas ao banco.

## Para levar

- Antes de otimizar o cálculo, **conte as consultas**. Muitas vezes o tempo está no caminho até o banco, e não na regra.
- `Include`, projeção e `AsNoTracking` resolvem a maior parte dos casos de leitura.
- Dados de referência que se repetem num laço quase sempre podem ir para um dicionário.
- Mudança de performance boa é a que não muda o resultado: compare a saída antes e depois.
