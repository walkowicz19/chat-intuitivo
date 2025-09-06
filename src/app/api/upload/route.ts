import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { message: 'Nenhuma imagem enviada' },
        { status: 400 }
      )
    }
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Tipo de arquivo não permitido' },
        { status: 400 }
      )
    }
    
    // Validar tamanho do arquivo (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'Arquivo muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      )
    }
    
    // Gerar nome de arquivo único
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileExtension = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(process.cwd(), 'public', 'uploads', fileName)
    
    // Salvar arquivo
    await writeFile(filePath, buffer)
    
    // Retornar URL da imagem
    const imageUrl = `/uploads/${fileName}`
    
    return NextResponse.json({
      message: 'Imagem enviada com sucesso',
      imageUrl
    })
    
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error)
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}