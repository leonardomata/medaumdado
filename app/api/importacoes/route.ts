import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar importações do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const empresaId = searchParams.get("empresaId")

    const where: any = {
      usuarioId: session.user.id,
    }

    if (empresaId) {
      where.empresaId = empresaId
    }

    const importacoes = await prisma.importacao.findMany({
      where,
      include: {
        empresa: {
          select: {
            id: true,
            nomeEmpresa: true,
          },
        },
      },
      orderBy: {
        criadoEm: "desc",
      },
    })

    return NextResponse.json(importacoes)
  } catch (error) {
    console.error("Erro ao buscar importações:", error)
    return NextResponse.json(
      { error: "Erro ao buscar importações" },
      { status: 500 }
    )
  }
}

// POST - Criar nova importação
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { empresaId, tipoOrigem, nomeOrigem, urlOrigem } = await req.json()

    // Validações
    if (!empresaId || !tipoOrigem || !nomeOrigem) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    // Verificar se a empresa pertence ao usuário
    const empresa = await prisma.empresa.findFirst({
      where: {
        id: empresaId,
        usuarioId: session.user.id,
      },
    })

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      )
    }

    // Criar importação
    const importacao = await prisma.importacao.create({
      data: {
        usuarioId: session.user.id,
        empresaId,
        tipoOrigem,
        nomeOrigem,
        urlOrigem,
        status: "processando",
      },
    })

    return NextResponse.json(importacao, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar importação:", error)
    return NextResponse.json(
      { error: "Erro ao criar importação" },
      { status: 500 }
    )
  }
}
