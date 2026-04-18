'use client'

import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading } from '@hugeicons/core-free-icons'
import { useCreateProjectMember } from '@/lib/api/project-member/mutations'

export default function JoinProject({ projectId }: { projectId: string }) {
  const router = useRouter()

  const createProjectMember = useCreateProjectMember()

  async function handleJoinProject() {
    createProjectMember.mutate(projectId as string, {
      onSuccess: (res) => {
        if (res.success) {
          router.push(`/project/${projectId}`)
          toast.success('Joined project successfully')
        } else {
          toast.error(res.error)
        }
      },
      onError: (error: Error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <Button
      onClick={handleJoinProject}
      disabled={createProjectMember.isPending}
      className="disabled:opacity-50"
    >
      {createProjectMember.isPending && <HugeiconsIcon icon={Loading} className="animate-spin" />}
      Join
    </Button>
  )
}
