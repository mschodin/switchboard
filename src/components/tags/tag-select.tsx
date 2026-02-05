'use client'

import { useTags } from '@/hooks/use-tags'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import { useState } from 'react'

interface TagSelectProps {
  value: string[]
  onChange: (tagIds: string[]) => void
  className?: string
}

export function TagSelect({ value, onChange, className }: TagSelectProps) {
  const { tags, isLoading } = useTags()
  const [isOpen, setIsOpen] = useState(false)

  const selectedTags = tags.filter((tag) => value.includes(tag.id))

  const toggleTag = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter((id) => id !== tagId))
    } else {
      onChange([...value, tagId])
    }
  }

  const removeTag = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId))
  }

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md">
        {selectedTags.length === 0 ? (
          <span className="text-sm text-muted-foreground">
            Select categories...
          </span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="gap-1"
              style={{
                backgroundColor: `${tag.color}20`,
                color: tag.color,
                borderColor: tag.color,
              }}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      <div className="border rounded-md">
        <ScrollArea className="h-48">
          <div className="p-2 space-y-1">
            {tags.map((tag) => {
              const isSelected = value.includes(tag.id)
              return (
                <Button
                  key={tag.id}
                  type="button"
                  variant="ghost"
                  className={cn(
                    'w-full justify-start font-normal',
                    isSelected && 'bg-secondary'
                  )}
                  onClick={() => toggleTag(tag.id)}
                >
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
