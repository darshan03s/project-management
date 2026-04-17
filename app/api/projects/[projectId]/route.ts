import { NextRequest, NextResponse } from 'next/server'
import { withErrorHandler } from '@/lib/error-handler'
import { requireProject } from '@/lib/guards'

export const GET = withErrorHandler(async function (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const project = await requireProject(projectId)

  return NextResponse.json({ success: false, data: { project } })
})
