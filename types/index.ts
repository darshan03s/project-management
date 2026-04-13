import { project, projectMember } from '@/db/schema'
import { getProjectByProjectId } from '@/db/utils'
import { InferSelectModel } from 'drizzle-orm'

export type Project = InferSelectModel<typeof project>

export type ProjectMember = InferSelectModel<typeof projectMember> & {
  name: string | null
  email: string | null
}

export type ProjectWithOwner = Awaited<ReturnType<typeof getProjectByProjectId>>
