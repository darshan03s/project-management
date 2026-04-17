import { db } from '@/db'
import { projectMember, user } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export const ProjectMember = {
  async getByProjectIdAndUserId(projectId: string, userId: string) {
    return await db
      .select()
      .from(projectMember)
      .where(and(eq(projectMember.projectId, projectId), eq(projectMember.userId, userId)))
      .limit(1)
  },

  async getAllByProjectId(projectId: string) {
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
  },

  async deleteById(memberId: string) {
    return await db.delete(projectMember).where(eq(projectMember.id, memberId)).returning()
  },

  async get(userId: string, projectId: string) {
    const res = await db
      .select()
      .from(projectMember)
      .where(and(eq(projectMember.userId, userId), eq(projectMember.projectId, projectId)))
      .limit(1)

    return res
  },

  async add(userId: string, projectId: string) {
    await db.insert(projectMember).values({
      id: randomUUID(),
      userId,
      projectId,
      role: 'MEMBER'
    })
  }
}
