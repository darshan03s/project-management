import { useQuery } from '@tanstack/react-query'
import { projectKeys } from './keys'
import { getProjectRequest, getProjectsRequest } from './api'

type UseProjectsOptions = {
  enabled?: boolean
}

export const useProjects = (options?: UseProjectsOptions) => {
  return useQuery({
    queryKey: projectKeys.all,
    enabled: options?.enabled ?? true,
    queryFn: () => getProjectsRequest()
  })
}

export const useProject = (id?: string) => {
  return useQuery({
    queryKey: id ? projectKeys.detail(id) : projectKeys.all,
    enabled: !!id,
    queryFn: () => getProjectRequest(id!)
  })
}
