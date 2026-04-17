import { deleteMemberById } from '@/db/utils'
import { withErrorHandler } from '@/lib/error-handler'
import { AppError, NotFoundError } from '@/lib/errors'
import { requireAdmin, requireAuth } from '@/lib/guards'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = withErrorHandler(async function (
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const user = await requireAuth()

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  await requireAdmin(user.id, projectId)

  const { memberId } = await params

  try {
    const deleted = await deleteMemberById(memberId)
    if (!deleted.length) {
      throw new NotFoundError('Member not found or already removed', 'MEMBER_NOT_FOUND')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    throw new AppError('Could not remove member', 500, 'MEMBER_NOT_REMOVED')
  }
})
