'use server'

import { headers } from 'next/headers'
import { auth } from './auth'
import { NotFoundError, UnauthorizedError } from './errors'
import { Project } from './db/project'

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    throw new UnauthorizedError()
  }

  return session.user
}

export const requireProject = async (projectId: string) => {
  const projectData = await Project.getById(projectId)

  if (!projectData) {
    throw new NotFoundError('Project not found', 'PROJECT_NOT_FOUND')
  }

  return projectData
}

export const requireAdmin = async (userId: string, projectId: string) => {
  const projectData = await requireProject(projectId)

  if (projectData.adminId !== userId) {
    throw new UnauthorizedError('Unauthorized', 'NOT_ADMIN')
  }

  return projectData
}
