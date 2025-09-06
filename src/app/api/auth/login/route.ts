import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { message: 'Email e nome são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar ou criar usuário
    let user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name,
          isActive: true
        }
      })
    } else {
      // Atualizar nome e status se o usuário já existir
      user = await db.user.update({
        where: { id: user.id },
        data: {
          name,
          isActive: true
        }
      })
    }

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive
      }
    })

  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}