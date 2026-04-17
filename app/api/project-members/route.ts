import { addProjectMember, getMembersByProjectId, getProjectMember } from '@/db/utils'
import { withErrorHandler } from '@/lib/error-handler'
import { requireAuth } from '@/lib/guards'
import { NextRequest, NextResponse } from 'next/server'

export const POST = withErrorHandler(async function (req: NextRequest) {
  const user = await requireAuth()

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  const existingMember = await getProjectMember(user.id, projectId)

  if (existingMember.length > 0) {
    return NextResponse.json({ success: true })
  }

  await addProjectMember(user.id, projectId)

  return NextResponse.json({ success: true })
})

export const GET = async function (req: NextRequest) {
  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  const members = await getMembersByProjectId(projectId)

  return NextResponse.json({ success: true, data: { members } })
}
