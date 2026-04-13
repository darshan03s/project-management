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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Trash } from '@hugeicons/core-free-icons'

export default function ProjectMembers() {
  const project = useProjectStore((s) => s.project)
  const isAdmin = useProjectStore((s) => s.isAdmin)
  const projectId = project!.id

  const queryClient = useQueryClient()

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

  const removeMemberMutation = useMutation({
    mutationFn: async (memberUserId: string) => {
      const res = await fetch(`/api/project-members/${memberUserId}?projectId=${projectId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Could not remove member')
      }

      const json = await res.json()

      if (json.error) {
        toast.error(json.error)
      }

      return json
    },
    onSuccess: () => {
      toast.success('Removed member')
      queryClient.invalidateQueries({
        queryKey: ['members', projectId]
      })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  function handleRemoveMember(memberUserId: string) {
    removeMemberMutation.mutate(memberUserId)
  }

  const tableBodyRows = members?.map((member) => {
    return (
      <TableRow key={member.id}>
        <TableCell>{member.name}</TableCell>
        <TableCell>{member.email}</TableCell>
        <TableCell>{member.role}</TableCell>
        <TableCell>{new Date(member.createdAt).toLocaleString()}</TableCell>
        {isAdmin && (
          <TableCell>
            <Button
              variant={'destructive'}
              size={'icon-sm'}
              onClick={() => handleRemoveMember(member.userId)}
            >
              <HugeiconsIcon icon={Trash} />
            </Button>
          </TableCell>
        )}
      </TableRow>
    )
  })

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined</TableHead>
          {isAdmin && <TableHead>Remove</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={isAdmin ? 5 : 4} className="text-center">
              No members
            </TableCell>
          </TableRow>
        ) : (
          tableBodyRows
        )}
      </TableBody>
    </Table>
  )
}
