import { Server } from 'socket.io';
import { db } from '@/lib/db';

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Entrar em uma sala
    socket.on('joinRoom', async (data: { roomId: string; userId: string }) => {
      try {
        const { roomId, userId } = data;
        
        // Entrar na sala do socket
        socket.join(roomId);
        
        // Notificar outros usuários na sala
        socket.to(roomId).emit('userJoined', { userId, roomId });
        
        // Buscar usuário para enviar notificação
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { name: true }
        });
        
        if (user) {
          socket.to(roomId).emit('notification', {
            type: 'user_joined',
            message: `${user.name} entrou na sala`,
            userId,
            roomId
          });
        }
        
        console.log(`User ${userId} joined room ${roomId}`);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    // Sair de uma sala
    socket.on('leaveRoom', async (data: { roomId: string; userId: string }) => {
      try {
        const { roomId, userId } = data;
        
        // Sair da sala do socket
        socket.leave(roomId);
        
        // Notificar outros usuários na sala
        socket.to(roomId).emit('userLeft', { userId, roomId });
        
        // Buscar usuário para enviar notificação
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { name: true }
        });
        
        if (user) {
          socket.to(roomId).emit('notification', {
            type: 'user_left',
            message: `${user.name} saiu da sala`,
            userId,
            roomId
          });
        }
        
        console.log(`User ${userId} left room ${roomId}`);
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    // Enviar mensagem (inclui texto, emoji e imagem)
    socket.on('sendMessage', async (data: {
      content: string;
      type: 'TEXT' | 'IMAGE' | 'EMOJI';
      userId: string;
      roomId: string;
      imageUrl?: string;
    }) => {
      try {
        const { roomId, userId, content, type, imageUrl } = data;
        
        // Buscar usuário
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true }
        });
        
        if (!user) {
          console.error('User not found:', userId);
          return;
        }
        
        // Criar mensagem no banco de dados
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
        });
        
        // Enviar mensagem para todos na sala
        io.to(roomId).emit('message', {
          id: message.id,
          content: message.content,
          type: message.type,
          imageUrl: message.imageUrl,
          userId: message.userId,
          roomId: message.roomId,
          createdAt: message.createdAt,
          user: message.user
        });
        
        console.log(`Message sent in room ${roomId} by user ${userId}`);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Bem-vindo ao Chat Interativo!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};