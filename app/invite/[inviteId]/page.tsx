import { redirect } from 'next/navigation'
import PageWrapper from '@/components/page-wrapper'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { HugeiconsIcon } from '@hugeicons/react'
import { Briefcase01Icon, Link } from '@hugeicons/core-free-icons'
import JoinProject from '@/components/join-project'
import { ProjectInvite } from '@/lib/db/project-invite'
import { Project } from '@/lib/db/project'
import { ProjectMember } from '@/lib/db/project-member'

export default async function Page({ params }: { params: Promise<{ inviteId: string }> }) {
  const { inviteId } = await params

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const userId = session.user.id

  const invite = await ProjectInvite.getByInviteId(inviteId)

  if (!invite) {
    return (
      <PageWrapper className="flex items-center justify-center p-4">
        <Alert className="w-100 flex flex-col items-center gap-4 py-6">
          <span className="bg-primary text-primary-foreground p-2 rounded-full">
            <HugeiconsIcon icon={Link} />
          </span>
          <AlertTitle className="text-3xl">Invalid invite link!</AlertTitle>
          <AlertDescription>Check your invite link again</AlertDescription>
        </Alert>
      </PageWrapper>
    )
  }

  const projectData = await Project.getById(invite.projectId)

  if (!projectData) {
    return (
      <PageWrapper className="flex items-center justify-center p-4">
        <Alert className="w-100 flex flex-col items-center gap-4 py-6">
          <span className="bg-primary text-primary-foreground p-2 rounded-full">
            <HugeiconsIcon icon={Briefcase01Icon} />
          </span>
          <AlertTitle className="text-3xl">Project not found!</AlertTitle>
          <AlertDescription>The project you were invited for was not found</AlertDescription>
        </Alert>
      </PageWrapper>
    )
  }

  if (projectData.adminId === userId) {
    redirect(`/project/${projectData.id}`)
  }

  const memberRes = await ProjectMember.getByProjectIdAndUserId(projectData.id, userId)

  const isMember = memberRes.length > 0

  if (isMember) {
    redirect(`/project/${projectData.id}`)
  }

  return (
    <PageWrapper className="flex items-center justify-center p-4">
      <Alert className="w-100 flex flex-col items-center gap-4 py-6">
        <span className="bg-primary text-primary-foreground p-2 rounded-full">
          <HugeiconsIcon icon={Briefcase01Icon} />
        </span>
        <AlertTitle className="text-3xl">Join {projectData.name}</AlertTitle>
        <AlertDescription>You will join project as a member</AlertDescription>
        <JoinProject projectId={projectData.id} />
      </Alert>
    </PageWrapper>
  )
}
