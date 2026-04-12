'use client'

import InviteMembers from '@/components/invite-members'
import PageWrapper from '@/components/page-wrapper'
import { buttonVariants } from '@/components/ui/button'
import { capitalize, cn } from '@/lib/utils'
import { Project } from '@/types'
import { Github } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function Page() {
  const { projectId } = useParams()

  const { data: project, isLoading } = useQuery({
    queryKey: ['projects', projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<Project> => {
      const res = await fetch(`/api/projects/${projectId}`)

      if (!res.ok) toast.error('Could not fetch project')

      const json = await res.json()
      return json.project
    }
  })

  if (isLoading) {
    return <PageWrapper className="flex-1 flex items-center justify-center">Loading...</PageWrapper>
  }

  return (
    <div className="flex-1">
      <div className="project-info p-4 space-y-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{capitalize(project!.name)}</h1>
          <InviteMembers />
        </div>
        <p className="text-xs">{project?.description}</p>
        <div className="flex items-center gap-4">
          {project?.githubLink && (
            <Link
              href={project.githubLink}
              target="_blank"
              className={cn(buttonVariants(), 'text-xs flex items-center gap-1')}
            >
              <HugeiconsIcon icon={Github} className="size-4" />
              Github
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
