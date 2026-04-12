import { db } from '@/db'
import { projectMember } from '@/db/schema'
import { auth } from '@/lib/auth'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const POST = async (
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

    const existingMember = await db
      .select()
      .from(projectMember)
      .where(and(eq(projectMember.userId, userId), eq(projectMember.projectId, projectId)))
      .limit(1)

    if (existingMember.length > 0) {
      return NextResponse.json({ success: true })
    }

    await db.insert(projectMember).values({
      id: randomUUID(),
      userId,
      projectId,
      role: 'MEMBER'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('joinProjectAsMember error:', error)
    return NextResponse.json({ success: false, error: 'Could not join project' }, { status: 500 })
  }
}
