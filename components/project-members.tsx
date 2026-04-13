'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useProjectStore } from '@/stores/project-store'
import { ProjectMember } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function ProjectMembers() {
  const project = useProjectStore((s) => s.project)
  const projectId = project!.id

  const { data: members } = useQuery({
    queryKey: ['members', projectId],
    queryFn: async (): Promise<ProjectMember[]> => {
      const res = await fetch(`/api/project-members?projectId=${projectId}`)
      if (!res.ok) {
        toast.error('Failed to get project members')
      }
      const json = await res.json()
      if (json.error) {
        toast.error(json.error)
      }

      return json.data.members
    }
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.map((member) => {
          return (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{new Date(member.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
