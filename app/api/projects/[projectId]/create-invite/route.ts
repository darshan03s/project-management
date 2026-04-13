import { db } from '@/db'
import { project, projectInvite } from '@/db/schema'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) => {
  const { projectId } = await params
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const projectResult = await db
      .select({
        adminId: project.adminId
      })
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1)

    const projectData = projectResult[0]

    if (!projectData) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
    }

    if (projectData.adminId !== userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const existingInvite = await db
      .select()
      .from(projectInvite)
      .where(eq(projectInvite.projectId, projectId))
      .limit(1)

    if (existingInvite.length > 0) {
      return NextResponse.json({
        success: true,
        data: { inviteId: existingInvite[0].inviteId }
      })
    }

    const inviteId = randomUUID()

    await db.insert(projectInvite).values({
      id: randomUUID(),
      projectId,
      inviteId
    })

    return NextResponse.json({ success: true, data: { inviteId: inviteId } })
  } catch (error) {
    console.error('generateInviteLink error:', error)
    return NextResponse.json({ success: false, error: 'Could not create invite' }, { status: 500 })
  }
}
