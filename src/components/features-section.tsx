'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Users, 
  Zap, 
  Shield, 
  Smartphone, 
  Globe,
  Heart,
  Star
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: 'Chat em Tempo Real',
      description: 'Mensagens instantâneas com tecnologia Socket.IO para uma experiência fluida e responsiva.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Múltiplos Usuários',
      description: 'Conecte-se com várias pessoas simultaneamente em diferentes salas temáticas.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Ultra Rápido',
      description: 'Interface otimizada para carregamento rápido e resposta imediata.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Seguro e Privado',
      description: 'Suas conversas são protegidas com criptografia e segurança de dados.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Smartphone,
      title: 'Responsivo',
      description: 'Acesse de qualquer dispositivo com uma interface adaptável e intuitiva.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: Globe,
      title: 'Acesso Global',
      description: 'Conecte-se com pessoas de todo o mundo 24 horas por dia.',
      color: 'from-indigo-500 to-blue-500'
    }
  ]

  const testimonials = [
    {
      name: 'Ana Silva',
      role: 'Desenvolvedora',
      content: 'A melhor experiência de chat que já usei! Rápido, intuitivo e cheio de recursos.',
      rating: 5
    },
    {
      name: 'Carlos Santos',
      role: 'Designer',
      content: 'Adoro as salas temáticas e a possibilidade de enviar emojis e imagens.',
      rating: 5
    },
    {
      name: 'Mariana Costa',
      role: 'Estudante',
      content: 'Perfeito para conversar com amigos e conhecer novas pessoas com os mesmos interesses.',
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Recursos Incríveis
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tudo o que você precisa em um chat
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra recursos poderosos que tornam nossa plataforma de chat única e incomparável.
          </p>
        </motion.div>

        {/* Grid de features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <CardContent className="p-6">
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Seção de depoimentos */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-lg text-gray-600">
              Milhares de pessoas já estão aproveitando nossa plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="h-full bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">
              Comece sua jornada agora mesmo
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Junte-se a nossa comunidade e descubra uma nova forma de se conectar com pessoas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => window.location.href = '/login'}
              >
                Criar Conta Grátis
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                onClick={() => window.location.href = '/rooms'}
              >
                Explorar Salas
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}