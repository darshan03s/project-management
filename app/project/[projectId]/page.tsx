'use client'

import InviteMembers from '@/components/invite-members'
import PageWrapper from '@/components/page-wrapper'
import ProjectTabs from '@/components/project-tabs'
import { useProject } from '@/lib/api/project/queries'
import { authClient } from '@/lib/auth-client'
import { capitalize } from '@/lib/utils'
import { useProjectStore } from '@/stores/project-store'
import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function Page() {
  const { projectId } = useParams()

  const { data: user } = authClient.useSession()

  const { data: project, isLoading, error } = useProject(projectId as string)

  useEffect(() => {
    if (!project || !user) return

    useProjectStore.setState({
      project,
      isAdmin: project.adminId === user.user.id
    })
  }, [project, user])

  useEffect(() => {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      toast.error('Access denied')
    }
  }, [error])

  if (error instanceof Error && error.message === 'FORBIDDEN') {
    return (
      <PageWrapper className="flex-1 flex items-center justify-center">Access denied</PageWrapper>
    )
  }

  if (isLoading || !project) {
    return <PageWrapper className="flex-1 flex items-center justify-center">Loading...</PageWrapper>
  }

  return (
    <div className="flex-1">
      <div className="project-info p-4 space-y-3 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{capitalize(project!.name)}</h1>
          {user?.user.id === project?.adminId ? <InviteMembers /> : null}
        </div>

        <ProjectTabs />
      </div>
    </div>
  )
}
