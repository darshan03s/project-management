import { db } from '@/db'
import { project, projectInvite, projectMember, user } from '@/db/schema'
import { and, eq } from 'drizzle-orm'

export async function getUserProjects(userId: string) {
  return await db
    .select({
      id: project.id,
      name: project.name
    })
    .from(projectMember)
    .innerJoin(project, eq(projectMember.projectId, project.id))
    .where(eq(projectMember.userId, userId))
}

export async function getProjectByProjectId(projectId: string) {
  const result = await db.query.project.findFirst({
    where: eq(project.id, projectId),
    with: {
      admin: true
    }
  })

  return result
}

export async function getInviteByInviteId(inviteId: string) {
  const inviteRes = await db
    .select()
    .from(projectInvite)
    .where(eq(projectInvite.inviteId, inviteId))
    .limit(1)

  return inviteRes[0] ?? null
}

export async function getMemberByProjectIdAndUserId(projectId: string, userId: string) {
  return await db
    .select()
    .from(projectMember)
    .where(and(eq(projectMember.projectId, projectId), eq(projectMember.userId, userId)))
    .limit(1)
}

export async function getMembersByProjectId(projectId: string) {
  return await db
    .select({
      id: projectMember.id,
      projectId: projectMember.projectId,
      userId: user.id,
      role: projectMember.role,
      createdAt: projectMember.createdAt,
      name: user.name,
      email: user.email
    })
    .from(projectMember)
    .leftJoin(user, eq(projectMember.userId, user.id))
    .where(and(eq(projectMember.projectId, projectId), eq(projectMember.role, 'MEMBER')))
}

export async function deleteMemberById(memberId: string) {
  return await db.delete(projectMember).where(eq(projectMember.id, memberId)).returning()
}
