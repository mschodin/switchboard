'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-black/[0.08]">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !value.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
