import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await request.json()
    const { id: roomId } = await params

    if (!userId) {
      return NextResponse.json(
        { message: 'ID do usuário é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o usuário está na sala
    const roomUser = await db.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })

    if (!roomUser) {
      return NextResponse.json(
        { message: 'Usuário não está nesta sala' },
        { status: 404 }
      )
    }

    // Desativar usuário na sala
    await db.roomUser.update({
      where: { id: roomUser.id },
      data: {
        isActive: false,
        leftAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Usuário saiu da sala com sucesso'
    })

  } catch (error) {
    console.error('Erro ao sair da sala:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}