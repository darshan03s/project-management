import { db } from '@/db'
import { project, projectInvite, projectMember } from '@/db/schema'
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
  const result = await db.select().from(project).where(eq(project.id, projectId)).limit(1)

  return result[0] ?? null
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
