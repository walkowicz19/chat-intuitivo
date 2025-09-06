import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { message: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Atualizar status do usuário para inativo
    await db.user.update({
      where: { id: userId },
      data: { isActive: false }
    })

    // Remover usuário de todas as salas
    await db.roomUser.updateMany({
      where: { userId },
      data: { isActive: false, leftAt: new Date() }
    })

    return NextResponse.json({
      message: 'Logout realizado com sucesso'
    })

  } catch (error) {
    console.error('Erro no logout:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}