import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/error-handler'
import { requireProjectAccess } from '@/lib/guards'

export const GET = withErrorHandler(async function (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params
  const userId = req.headers.get('x-user-id')!

  const project = await requireProjectAccess(userId, projectId)

  return NextResponse.json({ success: true, data: { project } })
})
