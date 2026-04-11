import { project } from '@/db/schema'
import { InferSelectModel } from 'drizzle-orm'

export type Project = InferSelectModel<typeof project>
