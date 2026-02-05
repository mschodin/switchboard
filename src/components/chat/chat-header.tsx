import { MessageSquare } from 'lucide-react'

export function ChatHeader() {
  return (
    <div className="flex items-center gap-2 p-4 border-b border-black/[0.08]">
      <MessageSquare className="h-5 w-5 text-primary" />
      <div>
        <h2 className="text-sm font-semibold">Chat with Switchboard</h2>
        <p className="text-xs text-muted-foreground">AI Assistant</p>
      </div>
    </div>
  )
}
