'use client'

import PageWrapper from '@/components/page-wrapper'
import { Button } from '@/components/ui/button'
import { Google } from '@/components/ui/svgs/google'
import { authClient } from '@/lib/auth-client'
import { useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const inviteId = searchParams.get('invite')

  const callBackURL = inviteId ? `/invite/${inviteId}` : `/`

  async function handleSignIn() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: callBackURL
    })
  }

  return (
    <PageWrapper className="w-full flex items-center justify-center">
      <Button className="flex items-center gap-3" onClick={handleSignIn}>
        <Google /> Sign in with Google
      </Button>
    </PageWrapper>
  )
}
