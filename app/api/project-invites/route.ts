import { addProjectInvite, getProjectInvite } from '@/db/utils'
import { withErrorHandler } from '@/lib/error-handler'
import { requireAdmin, requireAuth } from '@/lib/guards'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const POST = withErrorHandler(async function (req: NextRequest) {
  const user = await requireAuth()

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  await requireAdmin(projectId, user.id)

  const existingInvite = await getProjectInvite(projectId)

  if (existingInvite.length > 0) {
    return NextResponse.json({
      success: true,
      data: { inviteId: existingInvite[0].inviteId }
    })
  }

  const inviteId = randomUUID()

  await addProjectInvite(inviteId, projectId)

  return NextResponse.json({ success: true, data: { inviteId: inviteId } })
})
