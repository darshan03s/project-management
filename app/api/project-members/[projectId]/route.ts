import { getMembersByProjectId } from '@/db/utils'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  const { projectId } = await params
  try {
    const members = await getMembersByProjectId(projectId)
    return NextResponse.json({ success: true, data: { members } })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: 'Failed to get project members' },
      { status: 500 }
    )
  }
}
