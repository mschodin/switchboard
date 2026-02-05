'use client'

import { useTags } from '@/hooks/use-tags'
import { useFilters } from '@/hooks/use-filters'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export function TagList() {
  const { tags, isLoading } = useTags()
  const { tags: selectedTags, toggleTag } = useFilters()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.slug)
        return (
          <Button
            key={tag.id}
            variant="ghost"
            className={cn(
              'w-full justify-start font-normal',
              isSelected && 'bg-secondary'
            )}
            onClick={() => toggleTag(tag.slug)}
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
  )
}
