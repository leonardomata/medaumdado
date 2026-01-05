import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT - Atualizar empresa
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { nomeEmpresa, segmento, fusoHorario } = await req.json()

    // Verificar se a empresa pertence ao usuário
    const empresaExistente = await prisma.empresa.findFirst({
      where: {
        id: params.id,
        usuarioId: session.user.id,
      },
    })

    if (!empresaExistente) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      )
    }

    // Atualizar empresa
    const empresa = await prisma.empresa.update({
      where: { id: params.id },
      data: {
        nomeEmpresa: nomeEmpresa || empresaExistente.nomeEmpresa,
        segmento: segmento !== undefined ? segmento : empresaExistente.segmento,
        fusoHorario: fusoHorario || empresaExistente.fusoHorario,
      },
    })

    return NextResponse.json(empresa)
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar empresa" },
      { status: 500 }
    )
  }
}

// DELETE - Deletar empresa
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    // Verificar se a empresa pertence ao usuário
    const empresa = await prisma.empresa.findFirst({
      where: {
        id: params.id,
        usuarioId: session.user.id,
      },
    })

    if (!empresa) {
      return NextResponse.json(
        { error: "Empresa não encontrada" },
        { status: 404 }
      )
    }

    // Deletar empresa (cascade vai deletar dados relacionados)
    await prisma.empresa.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Empresa deletada com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar empresa:", error)
    return NextResponse.json(
      { error: "Erro ao deletar empresa" },
      { status: 500 }
    )
  }
}
