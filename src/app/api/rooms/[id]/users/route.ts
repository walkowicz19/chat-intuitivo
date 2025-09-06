import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params

    const roomUsers = await db.roomUser.findMany({
      where: { roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isActive: true
          }
        }
      },
      orderBy: { joinedAt: 'asc' }
    })

    return NextResponse.json({
      users: roomUsers.map(roomUser => ({
        id: roomUser.id,
        userId: roomUser.userId,
        roomId: roomUser.roomId,
        isActive: roomUser.isActive,
        user: roomUser.user
      }))
    })

  } catch (error) {
    console.error('Erro ao buscar usuários da sala:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}