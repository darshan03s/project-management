import { ProjectInvite } from '@/lib/db/project-invite'
import { withErrorHandler } from '@/lib/error-handler'
import { requireAdmin } from '@/lib/guards'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const POST = withErrorHandler(async function (req: NextRequest) {
  const userId = req.headers.get('x-user-id')!

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  await requireAdmin(projectId, userId)

  const existingInvite = await ProjectInvite.getByProjectId(projectId)

  if (existingInvite.length > 0) {
    return NextResponse.json({
      success: true,
      data: { inviteId: existingInvite[0].inviteId }
    })
  }

  const inviteId = randomUUID()

  await ProjectInvite.add(inviteId, projectId)

  return NextResponse.json({ success: true, data: { inviteId: inviteId } })
})
