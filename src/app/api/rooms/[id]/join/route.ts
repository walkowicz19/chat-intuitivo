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

    // Verificar se a sala existe
    const room = await db.room.findUnique({
      where: { id: roomId }
    })

    if (!room) {
      return NextResponse.json(
        { message: 'Sala não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se o usuário já está na sala
    let roomUser = await db.roomUser.findUnique({
      where: {
        userId_roomId: {
          userId,
          roomId
        }
      }
    })

    if (roomUser) {
      // Reativar usuário na sala se já existir
      roomUser = await db.roomUser.update({
        where: { id: roomUser.id },
        data: {
          isActive: true,
          joinedAt: new Date(),
          leftAt: null
        }
      })
    } else {
      // Criar novo registro de usuário na sala
      roomUser = await db.roomUser.create({
        data: {
          userId,
          roomId,
          isActive: true,
          joinedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      message: 'Usuário entrou na sala com sucesso',
      roomUser
    })

  } catch (error) {
    console.error('Erro ao entrar na sala:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}