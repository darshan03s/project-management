'use server'

import { db } from '@/db'
import { project, projectInvite, projectMember } from '@/db/schema'
import { auth } from '@/lib/auth'
import { CreateProjectFormValues, createProjectSchema } from '@/lib/zod-schemas/project'
import { randomUUID } from 'crypto'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function createProjectAction(data: CreateProjectFormValues, userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const parsed = createProjectSchema.safeParse(data)

    if (!parsed.success) {
      return { error: 'Please enter valid data' }
    }

    const { name, description, githubLink } = data

    const result = await db.transaction(async (tx) => {
      const projectId = randomUUID()

      await tx.insert(project).values({
        id: projectId,
        name: name,
        description: description,
        githubLink: githubLink,
        ownerId: userId
      })

      await tx.insert(projectMember).values({
        id: randomUUID(),
        projectId,
        userId,
        role: 'OWNER'
      })

      return projectId
    })

    return { success: true, projectId: result }
  } catch (error) {
    console.error('createProjectAction error:', error)
    return { success: false, error: 'Failed to create project' }
  }
}

export async function generateInviteLink(projectId: string, userId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const projectResult = await db
      .select({
        ownerId: project.ownerId
      })
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1)

    const projectData = projectResult[0]

    if (!projectData) {
      return { success: false, error: 'Project not found' }
    }

    if (projectData.ownerId !== userId) {
      return { success: false, error: 'Unauthorized' }
    }

    const existingInvite = await db
      .select()
      .from(projectInvite)
      .where(eq(projectInvite.projectId, projectId))
      .limit(1)

    if (existingInvite.length > 0) {
      return {
        success: true,
        inviteId: existingInvite[0].inviteId
      }
    }

    const inviteId = randomUUID()

    await db.insert(projectInvite).values({
      id: randomUUID(),
      projectId,
      inviteId
    })

    return {
      success: true,
      inviteId
    }
  } catch (error) {
    console.error('generateInviteLink error:', error)
    return { success: false, error: 'Failed to generate invite link' }
  }
}

export async function joinProjectAsMember(projectId: string) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = session.user.id

  try {
    const existingMember = await db
      .select()
      .from(projectMember)
      .where(and(eq(projectMember.userId, userId), eq(projectMember.projectId, projectId)))
      .limit(1)

    if (existingMember.length > 0) {
      return { success: true }
    }

    await db.insert(projectMember).values({
      id: randomUUID(),
      userId,
      projectId,
      role: 'MEMBER'
    })

    return { success: true }
  } catch (error) {
    console.error('joinProjectAsMember error:', error)
    return { success: false, error: 'Failed to join project' }
  }
}
