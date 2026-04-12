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
import { generateInviteLink } from '@/actions/project'
import { authClient } from '@/lib/auth-client'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export default function InviteMembers() {
  const [inviteLink, setInViteLink] = useState('')
  const { data } = authClient.useSession()
  const { projectId } = useParams()

  async function handleInvite() {
    const inviteRes = await generateInviteLink(projectId as string, data!.user.id)

    if (inviteRes.error) {
      toast.error(inviteRes.error)
      return
    }

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${inviteRes.inviteId!}`

    setInViteLink(link)
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
