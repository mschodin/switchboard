import { MessageSquare } from 'lucide-react'

export function ChatHeader() {
  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <MessageSquare className="h-5 w-5 text-brand-500" />
      <div>
        <h2 className="text-sm font-semibold">Chat with Switchboard</h2>
        <p className="text-xs text-muted-foreground">AI Assistant</p>
      </div>
    </div>
  )
}
