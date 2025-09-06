'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, MessageCircle } from 'lucide-react'

interface Room {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  userCount?: number
  messageCount?: number
}

interface RoomCardProps {
  room: Room
  onJoinRoom: (roomId: string) => void
}

export function RoomCard({ room, onJoinRoom }: RoomCardProps) {
  return (
    <Card className="h-full transition-all hover:shadow-lg hover:scale-105">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: room.color }}
            />
            <CardTitle className="text-lg">{room.name}</CardTitle>
          </div>
          {room.isActive && (
            <Badge variant="outline" className="text-green-600">
              Ativa
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">
          {room.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{room.userCount || 0} usuários</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{room.messageCount || 0} mensagens</span>
            </div>
          </div>
        </div>
        <Button 
          onClick={() => onJoinRoom(room.id)}
          className="w-full"
          style={{ backgroundColor: room.color }}
        >
          Entrar na Sala
        </Button>
      </CardContent>
    </Card>
  )
}