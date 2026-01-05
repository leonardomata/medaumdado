import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type MappedRow = {
  canal?: string
  ferramenta?: string
  data?: string
  periodo?: string
  campanha?: string
  grupoAnuncio?: string
  anuncio?: string
  objetivo?: string
  moeda?: string
  [key: string]: any // Para métricas numéricas
}

// POST - Processar e salvar dados importados
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { importacaoId, mapeamento, dados } = await req.json()

    if (!importacaoId || !mapeamento || !dados || !Array.isArray(dados)) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    // Buscar importação e verificar permissões
    const importacao = await prisma.importacao.findFirst({
      where: {
        id: importacaoId,
        usuarioId: session.user.id,
      },
    })

    if (!importacao) {
      return NextResponse.json(
        { error: "Importação não encontrada" },
        { status: 404 }
      )
    }

    // Salvar mapeamentos
    const mapeamentoPromises = Object.entries(mapeamento).map(([original, mapeado]) =>
      prisma.mapeamentoCampo.create({
        data: {
          importacaoId,
          usuarioId: session.user.id,
          empresaId: importacao.empresaId,
          nomeColunaOriginal: original,
          campoMapeado: mapeado as string,
        },
      })
    )

    await Promise.all(mapeamentoPromises)

    // Processar e salvar dados
    let linhasImportadas = 0
    const erros: string[] = []

    for (const row of dados) {
      try {
        const dadoMapeado = aplicarMapeamento(row, mapeamento)

        // Validar campos obrigatórios
        if (!dadoMapeado.canal || !dadoMapeado.ferramenta || !dadoMapeado.data) {
          erros.push(`Linha ${linhasImportadas + 1}: campos obrigatórios faltando`)
          continue
        }

        // Criar registro
        await prisma.dadosMarketing.create({
          data: {
            usuarioId: session.user.id,
            empresaId: importacao.empresaId,
            canal: dadoMapeado.canal,
            ferramenta: dadoMapeado.ferramenta,
            data: new Date(dadoMapeado.data),
            periodo: dadoMapeado.periodo || "dia",
            campanha: dadoMapeado.campanha,
            grupoAnuncio: dadoMapeado.grupoAnuncio,
            anuncio: dadoMapeado.anuncio,
            objetivo: dadoMapeado.objetivo,
            moeda: dadoMapeado.moeda || "BRL",
            // Métricas (todas opcionais)
            impressoes: parseNumber(dadoMapeado.impressoes),
            alcance: parseNumber(dadoMapeado.alcance),
            cliques: parseNumber(dadoMapeado.cliques),
            ctr: parseNumber(dadoMapeado.ctr),
            cpc: parseNumber(dadoMapeado.cpc),
            cpm: parseNumber(dadoMapeado.cpm),
            investimento: parseNumber(dadoMapeado.investimento),
            conversoes: parseNumber(dadoMapeado.conversoes),
            custoPorConversao: parseNumber(dadoMapeado.custoPorConversao),
            receita: parseNumber(dadoMapeado.receita),
            roas: parseNumber(dadoMapeado.roas),
            leads: parseNumber(dadoMapeado.leads),
            sessoes: parseNumber(dadoMapeado.sessoes),
            usuarios: parseNumber(dadoMapeado.usuarios),
            engajamento: parseNumber(dadoMapeado.engajamento),
            seguidores: parseNumber(dadoMapeado.seguidores),
            emailsEnviados: parseNumber(dadoMapeado.emailsEnviados),
            emailsAbertos: parseNumber(dadoMapeado.emailsAbertos),
            emailsClicados: parseNumber(dadoMapeado.emailsClicados),
            oportunidades: parseNumber(dadoMapeado.oportunidades),
            vendas: parseNumber(dadoMapeado.vendas),
            ticketMedio: parseNumber(dadoMapeado.ticketMedio),
          },
        })

        linhasImportadas++
      } catch (error: any) {
        erros.push(`Linha ${linhasImportadas + 1}: ${error.message}`)
      }
    }

    // Atualizar status da importação
    await prisma.importacao.update({
      where: { id: importacaoId },
      data: {
        status: erros.length > 0 && linhasImportadas === 0 ? "erro" : "sucesso",
        linhasImportadas,
        mensagemErro: erros.length > 0 ? erros.join("; ") : null,
      },
    })

    return NextResponse.json({
      success: true,
      linhasImportadas,
      erros: erros.length > 0 ? erros : null,
    })
  } catch (error: any) {
    console.error("Erro ao processar importação:", error)
    return NextResponse.json(
      { error: "Erro ao processar importação: " + error.message },
      { status: 500 }
    )
  }
}

function aplicarMapeamento(row: Record<string, any>, mapeamento: Record<string, string>): MappedRow {
  const resultado: MappedRow = {}

  for (const [colunaOriginal, campoMapeado] of Object.entries(mapeamento)) {
    resultado[campoMapeado] = row[colunaOriginal]
  }

  return resultado
}

function parseNumber(value: any): number | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  // Remover símbolos de moeda e espaços
  const cleaned = String(value)
    .replace(/[R$\s%]/g, "")
    .replace(",", ".")

  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}
