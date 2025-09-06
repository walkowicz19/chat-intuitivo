'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle, Zap, Star } from 'lucide-react'
import { useNavigate } from '@/hooks/use-navigate'

interface Room {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  userCount?: number
  messageCount?: number
}

interface AnimatedRoomCardProps {
  room: Room
  index: number
}

const roomIcons = {
  'Sala Geral': '💬',
  'Sala de Tecnologia': '💻',
  'Sala de Jogos': '🎮',
  'Sala de Música': '🎵'
}

export function AnimatedRoomCard({ room, index }: AnimatedRoomCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleJoinRoom = () => {
    navigate(`/?roomId=${room.id}`)
  }

  const icon = roomIcons[room.name as keyof typeof roomIcons] || '💬'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="h-full"
    >
      <Card 
        className="h-full transition-all duration-300 cursor-pointer overflow-hidden group"
        style={{
          background: `linear-gradient(135deg, ${room.color}15, ${room.color}05)`,
          border: `2px solid ${room.color}30`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleJoinRoom}
      >
        <CardHeader className="relative">
          {/* Efeito de brilho animado */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${room.color}40, transparent 70%)`
            }}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <motion.div
                className="text-3xl"
                animate={{
                  rotate: isHovered ? [0, -10, 10, 0] : 0,
                  scale: isHovered ? 1.2 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                {icon}
              </motion.div>
              <div>
                <CardTitle className="text-lg font-bold">{room.name}</CardTitle>
                <div className="flex items-center space-x-1 mt-1">
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: room.color }}
                  />
                  {room.isActive && (
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: room.color, color: room.color }}
                    >
                      Ativa
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="h-5 w-5" style={{ color: room.color }} />
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <CardDescription className="text-sm mb-4 leading-relaxed">
            {room.description}
          </CardDescription>
          
          {/* Estatísticas com animação */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              className="flex items-center space-x-2 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-1 rounded-full bg-white/50">
                <Users className="h-4 w-4" style={{ color: room.color }} />
              </div>
              <span className="font-medium">{room.userCount || 0}</span>
              <span className="text-gray-600">usuários</span>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-2 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="p-1 rounded-full bg-white/50">
                <MessageCircle className="h-4 w-4" style={{ color: room.color }} />
              </div>
              <span className="font-medium">{room.messageCount || 0}</span>
              <span className="text-gray-600">mensagens</span>
            </motion.div>
          </div>
          
          {/* Botão animado */}
          <motion.div
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full font-semibold transition-all duration-300 group-hover:shadow-lg"
              style={{ 
                backgroundColor: room.color,
                boxShadow: isHovered ? `0 4px 15px ${room.color}40` : 'none'
              }}
            >
              <motion.div
                className="flex items-center space-x-2"
                animate={{ x: isHovered ? 5 : 0 }}
              >
                <span>Entrar na Sala</span>
                <Star className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
          
          {/* Partículas decorativas */}
          {isHovered && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ backgroundColor: room.color }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}