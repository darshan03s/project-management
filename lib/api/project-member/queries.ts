import { useQuery } from '@tanstack/react-query'
import { projectMemberKeys } from './keys'
import { getProjectMembersRequest } from './api'

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: projectMemberKeys.detail(projectId),
    queryFn: () => getProjectMembersRequest(projectId)
  })
}
