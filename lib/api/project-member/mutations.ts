import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProjectMemberRequest, removeProjectMemberRequest } from './api'
import { projectKeys } from '../project/keys'
import { projectMemberKeys } from './keys'

export const useCreateProjectMember = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (projectId: string) => createProjectMemberRequest(projectId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    }
  })
}

export const useRemoveProjectMember = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ memberId, projectId }: { memberId: string; projectId: string }) =>
      removeProjectMemberRequest(memberId, projectId),

    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: projectMemberKeys.detail(variables.projectId)
      })
    }
  })
}
