'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Button, buttonVariants } from './ui/button'
import { AddTeamIcon, Copy } from '@hugeicons/core-free-icons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

export default function InviteMembers() {
  const [inviteLink, setInViteLink] = useState('')
  const { projectId } = useParams()

  const createInviteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/create-invite`)

      if (!res.ok) {
        throw new Error('Could not create invite')
      }

      return await res.json()
    },
    onSuccess: (res) => {
      if (res.success) {
        const inviteId = res.data.inviteId as string
        const link = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${inviteId}`
        setInViteLink(link)
      } else {
        toast.error(res.error)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message)
    }
  })

  async function handleInvite() {
    createInviteMutation.mutate()
  }

  function handleCopyInviteLink() {
    navigator.clipboard.writeText(inviteLink)
    toast.success('Copied invite link to clipboard')
  }

  return (
    <Dialog>
      <DialogTrigger className={cn(buttonVariants())} onClick={handleInvite}>
        <HugeiconsIcon icon={AddTeamIcon} /> Invite
      </DialogTrigger>
      <DialogContent className="w-100">
        <DialogHeader>
          <DialogTitle>Invite members</DialogTitle>
          <DialogDescription>Invite members to work with</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-2">
          <Input value={inviteLink || 'Creating...'} disabled />
          <Button onClick={handleCopyInviteLink} disabled={inviteLink.length === 0}>
            <HugeiconsIcon icon={Copy} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
