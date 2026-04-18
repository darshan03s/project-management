import { useMutation } from '@tanstack/react-query'
import { createProjectInviteRequest } from './api'

export const useCreateProjectInvite = () => {
  return useMutation({
    mutationFn: (projectId: string) => createProjectInviteRequest(projectId)
  })
}
