'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { SimpleRoomCard } from '@/components/simple-room-card'

interface Room {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  userCount?: number
  messageCount?: number
}

export default function RoomsPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomStats, setRoomStats] = useState<Record<string, { userCount: number; messageCount: number }>>({})

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms()
      fetchRoomStats()
    }
  }, [isAuthenticated])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms)
      }
    } catch (error) {
      console.error('Erro ao buscar salas:', error)
    }
  }

  const fetchRoomStats = async () => {
    try {
      const response = await fetch('/api/rooms/stats')
      if (response.ok) {
        const data = await response.json()
        setRoomStats(data.stats)
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas das salas:', error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Redirecionando para login
  }

  // Adicionar estatísticas às salas
  const roomsWithStats = rooms.map(room => ({
    ...room,
    userCount: roomStats[room.id]?.userCount || 0,
    messageCount: roomStats[room.id]?.messageCount || 0
  }))

  const totalUsers = Object.values(roomStats).reduce((sum, stat) => sum + stat.userCount, 0)
  const totalMessages = Object.values(roomStats).reduce((sum, stat) => sum + stat.messageCount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Chat Interativo</h1>
              <Badge variant="outline" className="ml-3 text-blue-600">
                Salas
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/home')}
              >
                Página Inicial
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Salas Disponíveis
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Escolha uma sala para começar a conversar com outros usuários
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {rooms.length}
              </div>
              <div className="text-sm text-gray-600">Salas Ativas</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {totalUsers}
              </div>
              <div className="text-sm text-gray-600">Usuários Ativos</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {totalMessages}
              </div>
              <div className="text-sm text-gray-600">Mensagens</div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Salas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomsWithStats.map((room) => (
            <SimpleRoomCard
              key={room.id}
              room={room}
            />
          ))}
        </div>
      </div>
    </div>
  )
}