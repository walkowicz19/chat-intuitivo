import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Criar salas iniciais
  const rooms = await prisma.room.createMany({
    data: [
      {
        name: 'Sala Geral',
        description: 'Sala para conversas gerais e descontraídas',
        color: '#3B82F6', // Azul
      },
      {
        name: 'Sala de Tecnologia',
        description: 'Discussões sobre tecnologia e programação',
        color: '#10B981', // Verde
      },
      {
        name: 'Sala de Jogos',
        description: 'Conversas sobre jogos e entretenimento',
        color: '#F59E0B', // Laranja
      },
      {
        name: 'Sala de Música',
        description: 'Compartilhamento musical e discussões',
        color: '#EF4444', // Vermelho
      },
    ],
  })

  console.log('Created rooms:', rooms)

  // Criar usuários
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'matheus@example.com',
        name: 'Matheus',
        isActive: true,
      },
      {
        email: 'ellen@example.com',
        name: 'Ellen',
        isActive: true,
      },
      {
        email: 'test1@example.com',
        name: 'Test1',
        isActive: true,
      },
      {
        email: 'test2@example.com',
        name: 'Test2',
        isActive: true,
      },
    ],
  })

  console.log('Created users:', users)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })