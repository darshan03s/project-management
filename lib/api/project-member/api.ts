import { ProjectMember } from '@/types'

export const createProjectMemberRequest = async (projectId: string) => {
  const res = await fetch(`/api/project-members?projectId=${projectId}`, { method: 'POST' })

  if (!res.ok) {
    throw new Error('Could not join project')
  }

  return await res.json()
}

export const getProjectMembersRequest = async (projectId: string): Promise<ProjectMember[]> => {
  const res = await fetch(`/api/project-members?projectId=${projectId}`)

  if (!res.ok) {
    throw new Error('Failed to get project members')
  }
  const json = await res.json()

  return json.data.members
}

export const removeProjectMemberRequest = async (memberId: string, projectId: string) => {
  const res = await fetch(`/api/project-members/${memberId}?projectId=${projectId}`, {
    method: 'DELETE'
  })

  if (!res.ok) {
    throw new Error('Could not remove member')
  }

  return await res.json()
}
