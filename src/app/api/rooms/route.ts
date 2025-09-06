import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      rooms: rooms.map(room => ({
        id: room.id,
        name: room.name,
        description: room.description,
        color: room.color,
        isActive: room.isActive
      }))
    })
  } catch (error) {
    console.error('Erro ao buscar salas:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}