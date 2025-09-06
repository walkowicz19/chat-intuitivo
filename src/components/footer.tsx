'use client'

import { motion } from 'framer-motion'
import { Github, MessageCircle, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Chat Interativo</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Uma plataforma moderna de chat em tempo real, construída com as melhores 
              tecnologias para proporcionar uma experiência incrível de comunicação.
            </p>
          </motion.div>

          {/* Links rápidos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Chat em Tempo Real</li>
              <li className="hover:text-white transition-colors cursor-pointer">Múltiplas Salas</li>
              <li className="hover:text-white transition-colors cursor-pointer">Emojis e Imagens</li>
              <li className="hover:text-white transition-colors cursor-pointer">Design Responsivo</li>
            </ul>
          </motion.div>

          {/* Tecnologia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">Tecnologia</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Next.js 15</li>
              <li className="hover:text-white transition-colors cursor-pointer">TypeScript</li>
              <li className="hover:text-white transition-colors cursor-pointer">Tailwind CSS</li>
              <li className="hover:text-white transition-colors cursor-pointer">Socket.IO</li>
              <li className="hover:text-white transition-colors cursor-pointer">Prisma</li>
            </ul>
          </motion.div>
        </div>

        {/* Linha divisória */}
        <motion.div
          className="border-t border-gray-800 mt-8 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
              <span>Feito com</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>por Z.ai</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Github className="h-5 w-5" />
              </motion.a>
              
              <div className="text-sm text-gray-400">
                © 2024 Chat Interativo. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}