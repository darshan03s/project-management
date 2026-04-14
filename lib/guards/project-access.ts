import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getMemberByProjectIdAndUserId, getProjectByProjectId } from '@/db/utils'

export async function requireProjectAccess(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }

  const userId = session.user.id

  const member = await getMemberByProjectIdAndUserId(projectId, userId)

  if (!member.length) {
    throw new Error('FORBIDDEN')
  }

  const project = await getProjectByProjectId(projectId)

  if (!project) {
    throw new Error('NOT_FOUND')
  }

  return {
    user: session.user,
    project,
    role: member[0].role
  }
}
