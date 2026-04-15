'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tags = useMemo(
    () => searchParams.get('tags')?.split(',').filter(Boolean) ?? [],
    [searchParams]
  )
  const search = searchParams.get('q') ?? ''

  const setTags = useCallback(
    (newTags: string[]) => {
      const params = new URLSearchParams(searchParams.toString())
      if (newTags.length > 0) {
        params.set('tags', newTags.join(','))
      } else {
        params.delete('tags')
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const setSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const toggleTag = useCallback(
    (tag: string) => {
      const newTags = tags.includes(tag)
        ? tags.filter((t) => t !== tag)
        : [...tags, tag]
      setTags(newTags)
    },
    [tags, setTags]
  )

  const clearFilters = useCallback(() => {
    router.push(pathname)
  }, [pathname, router])

  return {
    tags,
    search,
    setTags,
    setSearch,
    toggleTag,
    clearFilters,
  }
}
