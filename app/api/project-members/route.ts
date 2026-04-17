import { ProjectMember } from '@/lib/db/project-member'
import { withErrorHandler } from '@/lib/error-handler'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withErrorHandler(async function (req: NextRequest) {
  const userId = req.headers.get('x-user-id')!

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  const existingMember = await ProjectMember.getByProjectIdAndUserId(userId, projectId)

  if (existingMember.length > 0) {
    return NextResponse.json({ success: true })
  }

  await ProjectMember.add(userId, projectId)

  return NextResponse.json({ success: true })
})

export const GET = async function (req: NextRequest) {
  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  const members = await ProjectMember.getAllByProjectId(projectId)

  return NextResponse.json({ success: true, data: { members } })
}
