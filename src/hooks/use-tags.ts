'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import type { Tag } from '@/types/database'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const supabase = createBrowserClient()
        const { data, error: fetchError } = await supabase
          .from('tags')
          .select('*')
          .order('name')

        if (fetchError) throw fetchError

        setTags(data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tags')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  return { tags, isLoading, error }
}
