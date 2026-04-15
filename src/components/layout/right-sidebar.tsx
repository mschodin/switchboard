'use client'

import { cn } from '@/lib/utils'
import { ChatContainer } from '@/components/chat/chat-container'

interface RightSidebarProps {
  className?: string
}

export function RightSidebar({ className }: RightSidebarProps) {
  return (
    <aside
      className={cn(
        'hidden lg:flex lg:w-sidebar-right lg:flex-shrink-0 flex-col border-l border-black/[0.08] bg-white',
        className
      )}
    >
      <ChatContainer />
    </aside>
  )
}
