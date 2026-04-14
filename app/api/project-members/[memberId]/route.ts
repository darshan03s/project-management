import { deleteMemberById } from '@/db/utils'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) => {
  const { memberId } = await params

  try {
    const deleted = await deleteMemberById(memberId)
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
