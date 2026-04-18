import { Project } from '@/types'

export const getProjectsRequest = async () => {
  const res = await fetch('/api/projects')

  if (!res.ok) {
    throw new Error('Failed to get projects')
  }

  const json = await res.json()
  return json.data.projects
}

export const getProjectRequest = async (id: string) => {
  const res = await fetch(`/api/projects/${id}`)

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.code || 'UNKNOWN_ERROR')
  }

  const json = await res.json()
  return json.data.project
}

export const createProjectRequest = async (data: Project) => {
  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data })
  })

  if (!res.ok) {
    throw new Error('Failed to create project')
  }

  return await res.json()
}
