'use client'

import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading } from '@hugeicons/core-free-icons'

export default function JoinProject({ projectId }: { projectId: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const joinProjectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/project-members?projectId=${projectId}`, { method: 'POST' })

      if (!res.ok) {
        throw new Error('Could not join project')
      }

      return await res.json()
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
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

  async function handleJoinProject() {
    joinProjectMutation.mutate()
  }

  return (
    <Button
      onClick={handleJoinProject}
      disabled={joinProjectMutation.isPending}
      className="disabled:opacity-50"
    >
      {joinProjectMutation.isPending && <HugeiconsIcon icon={Loading} className="animate-spin" />}
      Join
    </Button>
  )
}
