import { ProjectMember } from '@/lib/db/project-member'
import { withErrorHandler } from '@/lib/error-handler'
import { AppError, NotFoundError } from '@/lib/errors'
import { requireAdmin } from '@/lib/guards'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = withErrorHandler(async function (
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  const userId = req.headers.get('x-user-id')!

  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  await requireAdmin(userId, projectId)

  const { memberId } = await params

  try {
    const deleted = await ProjectMember.deleteById(memberId)
    if (!deleted.length) {
      throw new NotFoundError('Member not found or already removed', 'MEMBER_NOT_FOUND')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    throw new AppError('Could not remove member', 500, 'MEMBER_NOT_REMOVED')
  }
})
