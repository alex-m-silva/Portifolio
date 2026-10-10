---
titulo: Banco na nuvem via VPN: como diminuir as idas ao banco em rotinas em lote
descricao: Quando o banco sai do servidor local e vai para a nuvem, cada consulta fica mais cara. Quatro técnicas para rotinas em lote em .NET: blocos, cache de referência, auditoria agrupada e insert multi-row.
data: 2026-10-10
tags: [C#, .NET, SQL Server, Entity Framework, Performance]
rascunho: true
---

Uma rotina que roda bem com o banco na rede local pode ficar lenta de repente quando o banco vai para a nuvem e passa a ser acessado por VPN. O código é o mesmo, as consultas são as mesmas. O que mudou foi a **latência**: cada ida e volta ao banco, que antes custava menos de um milissegundo, passa a custar dezenas.

Numa rotina que faz milhares de idas ao banco, essa diferença se multiplica. A saída não é otimizar cada consulta, e sim **fazer menos consultas**, sem mudar o resultado.

## A conta que importa

Se cada ida ao banco custa 30 ms pela VPN, uma rotina com 5.000 idas gasta **2 minutos e meio só esperando a rede**, mesmo que o SQL Server responda instantaneamente. Reduzir para 50 idas derruba esse tempo para menos de 2 segundos.

Por isso as quatro técnicas abaixo têm o mesmo objetivo: trocar muitas idas pequenas por poucas idas maiores.

## 1. Carga em blocos

Em vez de buscar os registros um a um dentro do laço, a rotina busca de uma vez os registros de um bloco inteiro.

```csharp
// Exemplo simplificado: um bloco de 500 registros por consulta
const int TamanhoBloco = 500;
for (int i = 0; i < ids.Count; i += TamanhoBloco)
{
    var bloco = ids.Skip(i).Take(TamanhoBloco).ToList();
    var registros = contexto.Registros
        .Where(r => bloco.Contains(r.Id))
        .AsNoTracking()
        .ToList();

    foreach (var registro in registros)
        Processar(registro);
}
```

O tamanho do bloco é um equilíbrio: blocos grandes fazem menos idas ao banco, mas consomem mais memória e esbarram no limite de 2.100 parâmetros do SQL Server.

## 2. Cache dos dados de referência

Tabelas que quase não mudam (tipos, faixas, configurações) costumam ser consultadas dentro do laço, uma vez por registro. Carregar tudo uma vez no início da rotina e guardar num dicionário elimina essas idas.

```csharp
// Exemplo simplificado
var tiposPorCodigo = contexto.Tipos
    .AsNoTracking()
    .ToDictionary(t => t.Codigo);

// Dentro do laço: memória, sem banco
var tipo = tiposPorCodigo[registro.CodigoTipo];
```

## 3. Auditoria agrupada

Registrar uma linha de auditoria a cada operação é comum, e cada registro vira um `INSERT` separado. Juntando as linhas de auditoria em memória e gravando todas no fim do bloco, centenas de idas viram uma.

```csharp
// Exemplo simplificado
var auditoria = new List<RegistroAuditoria>();

foreach (var registro in registros)
{
    Processar(registro);
    auditoria.Add(new RegistroAuditoria(registro.Id, "processado", DateTime.Now));
}

GravarEmLote(auditoria); // uma ida ao banco por bloco
```

## 4. Insert multi-row

Para gravar várias linhas, um único `INSERT` com vários `VALUES` é muito mais rápido que um `INSERT` por linha. Os valores continuam indo como parâmetros, nunca concatenados no texto do SQL.

```csharp
// Exemplo simplificado: INSERT ... VALUES (@p0, @p1), (@p2, @p3), ...
var sql = new StringBuilder("INSERT INTO Auditoria (RegistroId, Acao) VALUES ");
var parametros = new List<SqlParameter>();

for (int i = 0; i < itens.Count; i++)
{
    if (i > 0) sql.Append(", ");
    sql.Append($"(@id{i}, @acao{i})");
    parametros.Add(new SqlParameter($"@id{i}", itens[i].RegistroId));
    parametros.Add(new SqlParameter($"@acao{i}", itens[i].Acao));
}

contexto.Database.ExecuteSqlCommand(sql.ToString(), parametros.ToArray());
```

Para volumes bem grandes, o `SqlBulkCopy` é ainda mais eficiente. Para algumas centenas de linhas por bloco, o insert multi-row resolve com menos código.

## Sem mudar o resultado

A regra para essas mudanças entrarem foi uma só: **o resultado tem que ser idêntico**. Antes de trocar a rotina, vale rodar a versão antiga e a nova sobre a mesma base e comparar o que foi gravado. Performance que muda o resultado é bug.

## Para levar

- Com o banco na nuvem, o gargalo costuma ser o **número de idas**, não o tempo de cada consulta.
- Blocos, cache de referência, auditoria agrupada e insert multi-row atacam o mesmo problema por lados diferentes.
- Meça antes e depois, e compare os dados gravados: a mudança só vale se o resultado for o mesmo.
