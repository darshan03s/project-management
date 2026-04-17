import { addProjectMember, getMembersByProjectId, getProjectMember } from '@/db/utils'
import { withErrorHandler } from '@/lib/error-handler'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withErrorHandler(async function (req: NextRequest) {
  const userId = req.headers.get('x-user-id')!

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  const existingMember = await getProjectMember(userId, projectId)

  if (existingMember.length > 0) {
    return NextResponse.json({ success: true })
  }

  await addProjectMember(userId, projectId)

  return NextResponse.json({ success: true })
})

export const GET = async function (req: NextRequest) {
  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  const members = await getMembersByProjectId(projectId)

  return NextResponse.json({ success: true, data: { members } })
}
