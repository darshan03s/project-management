export const createProjectInviteRequest = async (projectId: string) => {
  const res = await fetch(`/api/project-invites/?projectId=${projectId}`, { method: 'POST' })

  if (!res.ok) {
    throw new Error('Could not create invite')
  }

  return await res.json()
}
