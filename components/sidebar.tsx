'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Project } from '@/types'

export default function Sidebar() {
  const { data: projects, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const res = await fetch('/api/projects', {
        cache: 'no-store'
      })

      if (!res.ok) {
        throw new Error('Failed to fetch projects')
      }

      const json = await res.json()
      return json.data
    }
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  return (
    <aside className="h-[calc(100vh-48px)] bg-secondary w-60 p-2">
      <Collapsible className="w-full">
        <CollapsibleTrigger
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'w-full flex items-center justify-between'
          )}
        >
          Projects
          <HugeiconsIcon icon={ArrowDown01Icon} />
        </CollapsibleTrigger>
        <CollapsibleContent className="text-sm ml-4 border-l-2">
          {projects?.map((project) => {
            return (
              <div key={project.id} className="pl-4 truncate">
                {project.name}
              </div>
            )
          })}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  )
}
