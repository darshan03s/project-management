import { createProject, getUserProjects } from '@/db/utils'
import { withErrorHandler } from '@/lib/error-handler'
import { requireAuth } from '@/lib/guards'
import { createProjectSchema } from '@/lib/zod-schemas/project'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const revalidate = 0

export const GET = withErrorHandler(async function () {
  const user = await requireAuth()
  const projects = await getUserProjects(user.id)
  return NextResponse.json({ success: true, data: { projects } })
})

export const POST = withErrorHandler(async function (req: NextRequest) {
  const user = await requireAuth()

  const body = await req.json()
  const data = body.data

  const parsed = createProjectSchema.safeParse(data)

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 422 })
  }

  const { name, description, githubLink } = data

  const result = await createProject(user.id, randomUUID(), name, description, githubLink)

  return NextResponse.json({ success: true, data: { projectId: result } })
})
