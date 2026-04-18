import { CreateProjectFormValues } from '@/lib/zod-schemas/project'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from './keys'
import { createProjectRequest } from './api'

export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProjectFormValues) => createProjectRequest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    }
  })
}
