import { db } from '@/db'
import { project, projectMember } from '@/db/schema'
import { eq } from 'drizzle-orm'

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
