'use client'

import { useState } from 'react'
import { ChatHeader } from './chat-header'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'
import type { ChatMessage } from '@/types/api'

export function ChatContainer() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I can help you find and explore API endpoints. What are you looking for?',
      timestamp: new Date(),
    },
  ])

  const handleSend = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Mock response - replace with actual AI integration
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'AI chat functionality is coming soon! For now, you can browse endpoints using the search and filters on the left.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  )
}
