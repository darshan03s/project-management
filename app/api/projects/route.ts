import { getUserProjects } from '@/db/utils'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

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
