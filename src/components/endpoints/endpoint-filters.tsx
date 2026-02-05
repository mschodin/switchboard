'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useFilters } from '@/hooks/use-filters'
import { useTags } from '@/hooks/use-tags'
import { X } from 'lucide-react'

export function EndpointFilters() {
  const { tags: selectedTags, clearFilters, toggleTag } = useFilters()
  const { tags: allTags } = useTags()

  if (selectedTags.length === 0) {
    return null
  }

  const selectedTagObjects = allTags.filter((tag) =>
    selectedTags.includes(tag.slug)
  )

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">Filtered by:</span>
      {selectedTagObjects.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className="gap-1 pr-1"
          style={{
            backgroundColor: `${tag.color}20`,
            color: tag.color,
            borderColor: tag.color,
          }}
        >
          {tag.name}
          <button
            onClick={() => toggleTag(tag.slug)}
            className="ml-1 hover:opacity-70 rounded-full p-0.5 transition-opacity duration-200"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button variant="ghost" size="sm" onClick={clearFilters}>
        Clear all
      </Button>
    </div>
  )
}
