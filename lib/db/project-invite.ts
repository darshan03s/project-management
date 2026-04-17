import { db } from '@/db'
import { projectInvite } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const ProjectInvite = {
  async getByInviteId(inviteId: string) {
    const inviteRes = await db
      .select()
      .from(projectInvite)
      .where(eq(projectInvite.inviteId, inviteId))
      .limit(1)

    return inviteRes[0] ?? null
  },

  async getByProjectId(projectId: string) {
    const existingInvite = await db
      .select()
      .from(projectInvite)
      .where(eq(projectInvite.projectId, projectId))
      .limit(1)

    return existingInvite
  },

  async add(inviteId: string, projectId: string) {
    const res = await db
      .insert(projectInvite)
      .values({
        id: inviteId,
        projectId,
        inviteId
      })
      .returning()

    return res
  }
}
