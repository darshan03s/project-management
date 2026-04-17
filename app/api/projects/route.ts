import { Project } from '@/lib/db/project'
import { withErrorHandler } from '@/lib/error-handler'
import { createProjectSchema } from '@/lib/zod-schemas/project'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withErrorHandler(async function (req: NextRequest) {
  const userId = req.headers.get('x-user-id')!
  const projects = await Project.getByUserId(userId)
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

  const result = await Project.create(userId, name, description, githubLink)

  return NextResponse.json({ success: true, data: { projectId: result } })
})
