import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  githubLink: z.url('Invalid URL').optional().or(z.literal(''))
})

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>
