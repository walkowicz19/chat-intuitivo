'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedRoomCard } from './animated-room-card'
import { useNavigate } from '@/hooks/use-navigate'
import { ArrowRight, Sparkles } from 'lucide-react'

interface Room {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  userCount?: number
  messageCount?: number
}

interface RoomsShowcaseProps {
  rooms: Room[]
  roomStats: Record<string, { userCount: number; messageCount: number }>
}

export function RoomsShowcase({ rooms, roomStats }: RoomsShowcaseProps) {
  const navigate = useNavigate()

  // Adicionar estatísticas às salas
  const roomsWithStats = rooms.map(room => ({
    ...room,
    userCount: roomStats[room.id]?.userCount || 0,
    messageCount: roomStats[room.id]?.messageCount || 0
  }))

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho da seção */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 mb-4"
            whileHover={{ x: 10 }}
          >
            <Sparkles className="h-6 w-6 text-purple-600" />
            <Badge variant="outline" className="text-purple-600 border-purple-600 px-4 py-2">
              Salas Disponíveis
            </Badge>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Escolha Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Comunidade</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cada sala tem seu próprio tema e vibe. Encontre o lugar perfeito para suas conversas 
            e conecte-se com pessoas que compartilham seus interesses.
          </p>
        </motion.div>

        {/* Grid de salas animado */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {roomsWithStats.map((room, index) => (
            <AnimatedRoomCard
              key={room.id}
              room={room}
              index={index}
            />
          ))}
        </div>

        {/* Estatísticas gerais animadas */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100"
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <motion.div
              className="text-5xl font-bold text-blue-600 mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              {rooms.length}
            </motion.div>
            <div className="text-gray-600 font-medium">Salas Ativas</div>
            <div className="text-sm text-gray-500 mt-1">Espaços para conversar</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100"
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <motion.div
              className="text-5xl font-bold text-green-600 mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", delay: 0.1 }}
              viewport={{ once: true }}
            >
              {Object.values(roomStats).reduce((sum, stat) => sum + stat.userCount, 0)}
            </motion.div>
            <div className="text-gray-600 font-medium">Usuários Ativos</div>
            <div className="text-sm text-gray-500 mt-1">Pessoas conectadas</div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100"
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <motion.div
              className="text-5xl font-bold text-purple-600 mb-2"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
              viewport={{ once: true }}
            >
              {Object.values(roomStats).reduce((sum, stat) => sum + stat.messageCount, 0)}
            </motion.div>
            <div className="text-gray-600 font-medium">Mensagens</div>
            <div className="text-sm text-gray-500 mt-1">Conversas ativas</div>
          </motion.div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Pronto para Começar?</h3>
              <p className="text-blue-100 mb-6 text-lg">
                Junte-se a milhares de usuários e participe das conversas mais animadas da internet!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <button
                  onClick={() => navigate('/')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <span>Ir para o Chat Agora</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}