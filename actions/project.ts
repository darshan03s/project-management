'use server'

import { CreateProjectFormValues, createProjectSchema } from '@/lib/zod-schemas/project'

export async function createProjectAction(data: CreateProjectFormValues) {
  const parsed = createProjectSchema.safeParse(data)

  if (!parsed.success) {
    return { error: 'Please enter valid data' }
  }

  // TODO: save to DB

  return { success: true }
}
