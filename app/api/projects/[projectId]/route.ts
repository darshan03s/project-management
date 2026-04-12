import { getProjectByProjectId } from '@/db/utils'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  const { projectId } = await params
  const project = await getProjectByProjectId(projectId)
  return NextResponse.json({ project: project })
}
