import { project } from '@/db/schema'
import { getProjectByProjectId } from '@/db/utils'
import { InferSelectModel } from 'drizzle-orm'

export type Project = InferSelectModel<typeof project>

export type ProjectWithOwner = Awaited<ReturnType<typeof getProjectByProjectId>>
