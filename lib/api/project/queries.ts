import { useQuery } from '@tanstack/react-query'
import { projectKeys } from './keys'
import { getProjectRequest, getProjectsRequest } from './api'

export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.all,
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
