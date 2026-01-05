import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const empresaId = searchParams.get("empresaId")
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")
    const canal = searchParams.get("canal")
    const ferramenta = searchParams.get("ferramenta")

    // Construir filtros
    const where: any = {
      usuarioId: session.user.id,
    }

    if (empresaId) where.empresaId = empresaId
    if (canal) where.canal = canal
    if (ferramenta) where.ferramenta = ferramenta

    if (dataInicio && dataFim) {
      where.data = {
        gte: new Date(dataInicio),
        lte: new Date(dataFim),
      }
    }

    // Buscar dados agregados
    const dados = await prisma.dadosMarketing.findMany({
      where,
      select: {
        data: true,
        canal: true,
        ferramenta: true,
        investimento: true,
        leads: true,
        receita: true,
        roas: true,
        impressoes: true,
        cliques: true,
        conversoes: true,
        vendas: true,
      },
      orderBy: {
        data: "asc",
      },
    })

    // Calcular totais
    const totais = {
      investimento: 0,
      leads: 0,
      receita: 0,
      impressoes: 0,
      cliques: 0,
      conversoes: 0,
      vendas: 0,
    }

    dados.forEach((d) => {
      totais.investimento += d.investimento || 0
      totais.leads += d.leads || 0
      totais.receita += d.receita || 0
      totais.impressoes += d.impressoes || 0
      totais.cliques += d.cliques || 0
      totais.conversoes += d.conversoes || 0
      totais.vendas += d.vendas || 0
    })

    // Calcular ROAS médio
    const roasMedio = totais.investimento > 0 ? totais.receita / totais.investimento : 0

    // Agrupar por data para evolução temporal
    const evolucaoPorData = dados.reduce((acc: any, d) => {
      const dataKey = d.data.toISOString().split("T")[0]
      if (!acc[dataKey]) {
        acc[dataKey] = {
          data: dataKey,
          investimento: 0,
          leads: 0,
          receita: 0,
          conversoes: 0,
        }
      }
      acc[dataKey].investimento += d.investimento || 0
      acc[dataKey].leads += d.leads || 0
      acc[dataKey].receita += d.receita || 0
      acc[dataKey].conversoes += d.conversoes || 0
      return acc
    }, {})

    const evolucao = Object.values(evolucaoPorData)

    // Agrupar por canal
    const porCanal = dados.reduce((acc: any, d) => {
      if (!acc[d.canal]) {
        acc[d.canal] = {
          name: d.canal,
          investimento: 0,
          leads: 0,
          receita: 0,
        }
      }
      acc[d.canal].investimento += d.investimento || 0
      acc[d.canal].leads += d.leads || 0
      acc[d.canal].receita += d.receita || 0
      return acc
    }, {})

    // Agrupar por ferramenta
    const porFerramenta = dados.reduce((acc: any, d) => {
      if (!acc[d.ferramenta]) {
        acc[d.ferramenta] = {
          name: d.ferramenta,
          investimento: 0,
          leads: 0,
          receita: 0,
        }
      }
      acc[d.ferramenta].investimento += d.investimento || 0
      acc[d.ferramenta].leads += d.leads || 0
      acc[d.ferramenta].receita += d.receita || 0
      return acc
    }, {})

    // Dados do funil
    const funil = {
      impressoes: totais.impressoes,
      cliques: totais.cliques,
      leads: totais.leads,
      vendas: totais.vendas,
      taxaClique: totais.impressoes > 0 ? (totais.cliques / totais.impressoes) * 100 : 0,
      taxaConversaoLead: totais.cliques > 0 ? (totais.leads / totais.cliques) * 100 : 0,
      taxaConversaoVenda: totais.leads > 0 ? (totais.vendas / totais.leads) * 100 : 0,
    }

    return NextResponse.json({
      totais: {
        ...totais,
        roas: roasMedio,
      },
      evolucao,
      porCanal: Object.values(porCanal),
      porFerramenta: Object.values(porFerramenta),
      funil,
    })
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard" },
      { status: 500 }
    )
  }
}
