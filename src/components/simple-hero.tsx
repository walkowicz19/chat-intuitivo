'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from '@/hooks/use-navigate'
import { MessageCircle, Users, Zap, Sparkles } from 'lucide-react'

export function SimpleHero() {
  const navigate = useNavigate()

  return (
    <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Chat Interativo
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Conecte-se com pessoas de todo o mundo em nossas salas temáticas. 
            Uma experiência de chat moderna, divertida e interativa.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              '🚀 Tempo Real',
              '💬 Múltiplos Usuários', 
              '😊 Emojis',
              '📷 Imagens',
              '🎨 Salas Temáticas',
              '⚡ Rápido'
            ].map((badge) => (
              <Badge key={badge} variant="secondary" className="text-lg px-4 py-2">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/rooms')}
            >
              Explorar Salas
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-2"
              onClick={() => navigate('/')}
            >
              Ir para o Chat
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}