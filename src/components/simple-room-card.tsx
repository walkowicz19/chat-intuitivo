'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle } from 'lucide-react'
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

interface SimpleRoomCardProps {
  room: Room
}

const roomIcons = {
  'Sala Geral': '💬',
  'Sala de Tecnologia': '💻',
  'Sala de Jogos': '🎮',
  'Sala de Música': '🎵'
}

export function SimpleRoomCard({ room }: SimpleRoomCardProps) {
  const navigate = useNavigate()
  const icon = roomIcons[room.name as keyof typeof roomIcons] || '💬'

  const handleJoinRoom = () => {
    navigate(`/?roomId=${room.id}`)
  }

  return (
    <Card className="h-full transition-all hover:shadow-lg hover:scale-105 border-2 hover:border-gray-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{icon}</div>
            <div>
              <CardTitle className="text-lg">{room.name}</CardTitle>
              <div className="flex items-center space-x-1 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
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
        </div>
        <CardDescription className="text-sm">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{room.userCount || 0} usuários</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{room.messageCount || 0} mensagens</span>
            </div>
          </div>
          
          <Button 
            onClick={handleJoinRoom}
            className="w-full"
            style={{ backgroundColor: room.color }}
          >
            Entrar na Sala
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}