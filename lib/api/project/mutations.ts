import { CreateProjectFormValues } from '@/lib/zod-schemas/project'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { projectKeys } from './keys'

export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateProjectFormValues) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })

      if (!res.ok) {
        throw new Error('Could not create project')
      }

      return await res.json()
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
    }
  })
}
