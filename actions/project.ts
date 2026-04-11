'use server'

import { db } from '@/db'
import { project, projectMember } from '@/db/schema'
import { CreateProjectFormValues, createProjectSchema } from '@/lib/zod-schemas/project'
import { randomUUID } from 'crypto'

export async function createProjectAction(data: CreateProjectFormValues, userId: string) {
  const parsed = createProjectSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Please enter valid data' }
  }

  const { name, description, githubLink } = data

  try {
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
