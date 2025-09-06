import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roomId } = await params

    const messages = await db.message.findMany({
      where: { roomId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      messages: messages.map(message => ({
        id: message.id,
        content: message.content,
        type: message.type,
        imageUrl: message.imageUrl,
        userId: message.userId,
        roomId: message.roomId,
        createdAt: message.createdAt,
        user: message.user
      }))
    })

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content, type, userId, imageUrl } = await request.json()
    const { id: roomId } = await params

    if (!content || !userId || !type) {
      return NextResponse.json(
        { message: 'Conteúdo, usuário e tipo são obrigatórios' },
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

    // Verificar se o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Criar mensagem
    const message = await db.message.create({
      data: {
        content,
        type,
        imageUrl,
        userId,
        roomId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Mensagem enviada com sucesso',
      message: {
        id: message.id,
        content: message.content,
        type: message.type,
        imageUrl: message.imageUrl,
        userId: message.userId,
        roomId: message.roomId,
        createdAt: message.createdAt,
        user: message.user
      }
    })

  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}