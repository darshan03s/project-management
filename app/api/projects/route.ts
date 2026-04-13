import { db } from '@/db'
import { project, projectMember } from '@/db/schema'
import { getUserProjects } from '@/db/utils'
import { auth } from '@/lib/auth'
import { createProjectSchema } from '@/lib/zod-schemas/project'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'

export const revalidate = 0

export const GET = async () => {
  const authData = await auth.api.getSession({
    headers: await headers()
  })

  if (!authData?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const projects = await getUserProjects(authData.user.id)
  return NextResponse.json({ data: projects })
}

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  const data = body.data

  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const parsed = createProjectSchema.safeParse(data)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 422 })
    }

    const { name, description, githubLink } = data

    const result = await db.transaction(async (tx) => {
      const projectId = randomUUID()

      await tx.insert(project).values({
        id: projectId,
        name: name,
        description: description,
        githubLink: githubLink,
        adminId: userId
      })

      await tx.insert(projectMember).values({
        id: randomUUID(),
        projectId,
        userId,
        role: 'ADMIN'
      })

      return projectId
    })

    return NextResponse.json({ success: true, data: { projectId: result } })
  } catch (error) {
    console.error('createProjectAction error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 })
  }
}
