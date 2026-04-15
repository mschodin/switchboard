import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/database'

interface TagBadgeProps {
  tag: Tag
  size?: 'sm' | 'md'
  onClick?: () => void
  className?: string
}

export function TagBadge({ tag, size = 'sm', onClick, className }: TagBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        sizeClasses[size],
        'cursor-pointer transition-colors hover:opacity-80',
        className
      )}
      style={{
        backgroundColor: `${tag.color}20`,
        color: tag.color,
        borderColor: tag.color,
      }}
      onClick={onClick}
    >
      {tag.name}
    </Badge>
  )
}
