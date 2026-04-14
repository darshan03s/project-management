import { NextRequest, NextResponse } from 'next/server'
import { requireProjectAccess } from '@/lib/guards/project-access'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  try {
    const { projectId } = await params

    const { project } = await requireProjectAccess(projectId)

    return NextResponse.json({ success: false, data: { project } })
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'UNAUTHORIZED') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
      if (err.message === 'FORBIDDEN') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
      if (err.message === 'NOT_FOUND') {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 })
  }
}
