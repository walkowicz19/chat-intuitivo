'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { EmojiPicker } from '@/components/emoji-picker'
import { ImageUpload } from '@/components/image-upload'
import { io, Socket } from 'socket.io-client'

interface Room {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
}

interface Message {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'EMOJI'
  imageUrl?: string
  userId: string
  roomId: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface RoomUser {
  id: string
  userId: string
  roomId: string
  isActive: boolean
  user: {
    id: string
    name: string
    email: string
    isActive: boolean
  }
}

export default function Home() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user) {
      // Verificar se há um roomId na URL
      const urlParams = new URLSearchParams(window.location.search)
      const roomIdFromUrl = urlParams.get('roomId')
      
      // Carregar salas
      fetchRooms()
      
      // Configurar socket
      const newSocket = io('http://localhost:3000', {
        path: '/api/socketio',
      })
      
      newSocket.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to socket server')
      })
      
      newSocket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from socket server')
      })
      
      newSocket.on('message', (message: Message) => {
        console.log('Mensagem recebida via socket:', message)
        setMessages(prev => [...prev, message])
      })
      
      newSocket.on('userJoined', (data: { userId: string, roomId: string }) => {
        if (selectedRoom && selectedRoom.id === data.roomId) {
          fetchRoomUsers(data.roomId)
        }
      })
      
      newSocket.on('userLeft', (data: { userId: string, roomId: string }) => {
        if (selectedRoom && selectedRoom.id === data.roomId) {
          fetchRoomUsers(data.roomId)
        }
      })
      
      // Se houver um roomId na URL, entrar automaticamente na sala
      if (roomIdFromUrl) {
        const roomToJoin = rooms.find(room => room.id === roomIdFromUrl)
        if (roomToJoin) {
          joinRoom(roomToJoin)
        }
      }
      
      setSocket(newSocket)
      
      return () => {
        newSocket.close()
      }
    }
  }, [isAuthenticated, user, rooms])

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

  const fetchMessages = async (roomId: string) => {
    try {
      console.log('Buscando mensagens para a sala:', roomId)
      const response = await fetch(`/api/rooms/${roomId}/messages`)
      if (response.ok) {
        const data = await response.json()
        console.log('Mensagens recebidas:', data.messages)
        setMessages(data.messages)
      } else {
        console.error('Erro ao buscar mensagens:', response.status)
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
    }
  }

  const fetchRoomUsers = async (roomId: string) => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/users`)
      if (response.ok) {
        const data = await response.json()
        setRoomUsers(data.users)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários da sala:', error)
    }
  }

  const joinRoom = async (room: Room) => {
    if (!user) return
    
    try {
      const response = await fetch(`/api/rooms/${room.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })
      
      if (response.ok) {
        setSelectedRoom(room)
        fetchMessages(room.id)
        fetchRoomUsers(room.id)
        
        if (socket) {
          socket.emit('joinRoom', { roomId: room.id, userId: user.id })
        }
      }
    } catch (error) {
      console.error('Erro ao entrar na sala:', error)
    }
  }

  const leaveRoom = async () => {
    if (!selectedRoom || !user) return
    
    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })
      
      if (response.ok) {
        setSelectedRoom(null)
        setMessages([])
        setRoomUsers([])
        
        if (socket) {
          socket.emit('leaveRoom', { roomId: selectedRoom.id, userId: user.id })
        }
      }
    } catch (error) {
      console.error('Erro ao sair da sala:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user || !socket) return
    
    try {
      const messageData = {
        content: newMessage,
        type: 'TEXT' as const,
        userId: user.id,
        roomId: selectedRoom.id,
      }
      
      const response = await fetch(`/api/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
      
      if (response.ok) {
        socket.emit('sendMessage', messageData)
        setNewMessage('')
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
    }
  }

  const sendEmoji = async (emoji: string) => {
    if (!selectedRoom || !user || !socket) return
    
    try {
      console.log('Enviando emoji:', emoji)
      
      const messageData = {
        content: emoji,
        type: 'EMOJI' as const,
        userId: user.id,
        roomId: selectedRoom.id,
      }
      
      const response = await fetch(`/api/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Emoji salvo no banco:', result)
        socket.emit('sendMessage', messageData)
      } else {
        const errorData = await response.json()
        console.error('Erro ao salvar emoji no banco:', errorData)
      }
    } catch (error) {
      console.error('Erro ao enviar emoji:', error)
    }
  }

  const sendImage = async (imageUrl: string) => {
    if (!selectedRoom || !user || !socket) return
    
    try {
      console.log('Enviando imagem:', imageUrl)
      
      const messageData = {
        content: 'Imagem',
        type: 'IMAGE' as const,
        imageUrl,
        userId: user.id,
        roomId: selectedRoom.id,
      }
      
      const response = await fetch(`/api/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Imagem salva no banco:', result)
        socket.emit('sendMessage', messageData)
      } else {
        const errorData = await response.json()
        console.error('Erro ao salvar imagem no banco:', errorData)
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Chat Interativo</h1>
              {isConnected && (
                <Badge variant="outline" className="ml-2 text-green-600">
                  Conectado
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push('/rooms')}
              >
                Ver Salas
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lista de Salas */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Salas Disponíveis</CardTitle>
                <CardDescription>Selecione uma sala para entrar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRoom?.id === room.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (selectedRoom?.id === room.id) {
                        leaveRoom()
                      } else {
                        joinRoom(room)
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: room.color }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{room.name}</h3>
                        <p className="text-xs text-gray-500">{room.description}</p>
                      </div>
                      {selectedRoom?.id === room.id && (
                        <Badge variant="secondary" className="text-xs">
                          Ativo
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Usuários na Sala */}
            {selectedRoom && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Usuários na Sala</CardTitle>
                  <CardDescription>
                    {roomUsers.filter(u => u.isActive).length} ativos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {roomUsers.map((roomUser) => (
                    <div key={roomUser.id} className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {roomUser.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{roomUser.user.name}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            roomUser.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="text-xs text-gray-500">
                          {roomUser.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Área do Chat */}
          <div className="lg:col-span-3">
            {selectedRoom ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedRoom.color }}
                      />
                      <CardTitle>{selectedRoom.name}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={leaveRoom}>
                      Sair da Sala
                    </Button>
                  </div>
                  <CardDescription>{selectedRoom.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Mensagens */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.userId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.userId === user?.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-white border'
                          }`}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium">
                              {message.user.name}
                            </span>
                            <span className="text-xs opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          {message.type === 'IMAGE' && message.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={message.imageUrl}
                                alt="Imagem enviada"
                                className="max-w-full h-auto rounded-lg"
                                style={{ maxHeight: '200px' }}
                              />
                            </div>
                          )}
                          {message.type === 'EMOJI' && (
                            <div className="text-2xl text-center mt-1">
                              {message.content}
                            </div>
                          )}
                          {message.type === 'TEXT' && (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de Mensagem */}
                  <div className="flex space-x-2">
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            sendMessage()
                          }
                        }}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <EmojiPicker onEmojiSelect={sendEmoji} />
                      <ImageUpload onImageUpload={sendImage} />
                    </div>
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      Enviar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Bem-vindo ao Chat Interativo
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Selecione uma sala da lista para começar a conversar
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}