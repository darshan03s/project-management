import { db } from '@/db'
import { project, projectMember } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export const Project = {
  async getById(projectId: string) {
    const result = await db.query.project.findFirst({
      where: eq(project.id, projectId),
      with: {
        admin: true
      }
    })

    return result ?? null
  },

  async getByUserId(userId: string) {
    return await db
      .select({
        id: project.id,
        name: project.name
      })
      .from(projectMember)
      .innerJoin(project, eq(projectMember.projectId, project.id))
      .where(eq(projectMember.userId, userId))
  },

  async create(userId: string, name: string, description: string, githubLink: string) {
    const projectId = randomUUID()
    const result = await db.transaction(async (tx) => {
      await tx.insert(project).values({
        id: projectId,
        name: name,
        description: description,
        githubLink: githubLink,
        adminId: userId
      })

      await tx.insert(projectMember).values({
        id: randomUUID(),
        projectId,
        userId,
        role: 'ADMIN'
      })

      return projectId
    })

    return result
  }
}
