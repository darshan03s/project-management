import { createProject, getUserProjects } from '@/db/utils'
import { withErrorHandler } from '@/lib/error-handler'
import { createProjectSchema } from '@/lib/zod-schemas/project'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const revalidate = 0

export const GET = withErrorHandler(async function (req: NextRequest) {
  const userId = req.headers.get('x-user-id')!
  console.log({ userId })
  const projects = await getUserProjects(userId)
  return NextResponse.json({ success: true, data: { projects } })
})

export const POST = withErrorHandler(async function (req: NextRequest) {
  const userId = req.headers.get('x-user-id')!

  const body = await req.json()
  const data = body.data

  const parsed = createProjectSchema.safeParse(data)

  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 422 })
  }

  const { name, description, githubLink } = data

  const result = await createProject(userId, randomUUID(), name, description, githubLink)

  return NextResponse.json({ success: true, data: { projectId: result } })
})
