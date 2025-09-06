import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      where: { isActive: true },
      select: {
        id: true,
        _count: {
          select: {
            roomUsers: {
              where: { isActive: true }
            },
            messages: true
          }
        }
      }
    })

    const stats: Record<string, { userCount: number; messageCount: number }> = {}
    
    rooms.forEach(room => {
      stats[room.id] = {
        userCount: room._count.roomUsers,
        messageCount: room._count.messages
      }
    })

    return NextResponse.json({
      stats
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas das salas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}