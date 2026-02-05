'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TagBadge } from '@/components/tags/tag-badge'
import { StatusBadge } from './status-badge'
import { truncate } from '@/lib/utils'
import type { Endpoint } from '@/types/database'
import Image from 'next/image'
import { useState } from 'react'

interface EndpointCardProps {
  endpoint: Endpoint
  onClick?: () => void
}

export function EndpointCard({ endpoint, onClick }: EndpointCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const tags =
    endpoint.endpoint_tags?.map((et: any) => et.tag).filter(Boolean) ?? []

  const displayTags = tags.slice(0, 3)
  const remainingCount = tags.length - 3

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/10"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
            {endpoint.icon_url ? (
              <Image
                src={endpoint.icon_url}
                alt={endpoint.company}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
                {endpoint.company.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {endpoint.company}
            </p>
            <h3 className="text-lg font-medium truncate">{endpoint.title}</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {endpoint.description
            ? truncate(endpoint.description, 150)
            : 'No description provided'}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[24px]">
          {displayTags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
          {remainingCount > 0 && (
            <span className="text-xs text-muted-foreground px-2 py-0.5">
              +{remainingCount} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <StatusBadge status={endpoint.status} />
          <span className="text-xs text-muted-foreground">{endpoint.protocol}</span>
        </div>
      </CardContent>
    </Card>
  )
}
