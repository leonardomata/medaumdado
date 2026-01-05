import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Listar empresas do usuário
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const empresas = await prisma.empresa.findMany({
      where: {
        usuarioId: session.user.id,
      },
      orderBy: {
        criadoEm: "desc",
      },
    })

    return NextResponse.json(empresas)
  } catch (error) {
    console.error("Erro ao buscar empresas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar empresas" },
      { status: 500 }
    )
  }
}

// POST - Criar nova empresa
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { nomeEmpresa, segmento, fusoHorario } = await req.json()

    // Validações
    if (!nomeEmpresa) {
      return NextResponse.json(
        { error: "Nome da empresa é obrigatório" },
        { status: 400 }
      )
    }

    // Verificar limites do plano
    const user = await prisma.usuario.findUnique({
      where: { id: session.user.id },
      include: {
        empresas: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    // Limites de plano
    const limites = {
      Starter: 1,
      Pro: 5,
      Agencia: Infinity,
    }

    const limite = limites[user.plano as keyof typeof limites]
    if (user.empresas.length >= limite) {
      return NextResponse.json(
        {
          error: `Você atingiu o limite de ${limite} empresa(s) para o plano ${user.plano}. Faça upgrade para adicionar mais empresas.`,
        },
        { status: 400 }
      )
    }

    // Criar empresa
    const empresa = await prisma.empresa.create({
      data: {
        nomeEmpresa,
        segmento,
        fusoHorario: fusoHorario || "America/Sao_Paulo",
        usuarioId: session.user.id,
      },
    })

    return NextResponse.json(empresa, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar empresa:", error)
    return NextResponse.json(
      { error: "Erro ao criar empresa" },
      { status: 500 }
    )
  }
}
