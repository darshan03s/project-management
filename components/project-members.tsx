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
import { toast } from 'sonner'
import { Button } from './ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Trash } from '@hugeicons/core-free-icons'
import { useProjectMembers } from '@/lib/api/project-member/queries'
import { useRemoveProjectMember } from '@/lib/api/project-member/mutations'

export default function ProjectMembers() {
  const project = useProjectStore((s) => s.project)
  const isAdmin = useProjectStore((s) => s.isAdmin)
  const projectId = project!.id

  const { data: members } = useProjectMembers(projectId)

  const removeMember = useRemoveProjectMember()

  function handleRemoveMember(memberId: string) {
    removeMember.mutate(
      { memberId, projectId },
      {
        onSuccess: () => {
          toast.success('Removed member')
        },
        onError: (error: Error) => {
          toast.error(error.message)
        }
      }
    )
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
              onClick={() => handleRemoveMember(member.id)}
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
