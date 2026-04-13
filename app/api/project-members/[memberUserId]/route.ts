import { deleteMemberByIdAndProjectId } from '@/db/utils'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ memberUserId: string }> }
) => {
  const { memberUserId } = await params
  const url = new URL(req.nextUrl)
  const projectId = url.searchParams.get('projectId')!

  try {
    const deleted = await deleteMemberByIdAndProjectId(memberUserId, projectId)
    if (!deleted.length) {
      return NextResponse.json(
        { success: false, error: 'Member not found or already removed' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Could not remove member' }, { status: 500 })
  }
}
