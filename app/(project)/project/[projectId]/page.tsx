'use client'

import InviteMembers from '@/components/invite-members'
import PageWrapper from '@/components/page-wrapper'
import ProjectTabs from '@/components/project-tabs'
import { authClient } from '@/lib/auth-client'
import { capitalize } from '@/lib/utils'
import { useProjectStore } from '@/stores/project-store'
import { ProjectWithOwner } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function Page() {
  const { projectId } = useParams()

  const { data: user } = authClient.useSession()

  const { data: project, isLoading } = useQuery({
    queryKey: ['projects', projectId],
    enabled: !!projectId,
    queryFn: async (): Promise<ProjectWithOwner> => {
      const res = await fetch(`/api/projects/${projectId}`)

      if (!res.ok) toast.error('Could not fetch project')

      const json = await res.json()
      useProjectStore.setState({ project: json.project })
      return json.project
    }
  })

  if (isLoading || !project) {
    return <PageWrapper className="flex-1 flex items-center justify-center">Loading...</PageWrapper>
  }

  return (
    <div className="flex-1">
      <div className="project-info p-4 space-y-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{capitalize(project!.name)}</h1>
          {user?.user.id === project?.ownerId ? <InviteMembers /> : null}
        </div>

        <ProjectTabs />
      </div>
    </div>
  )
}
