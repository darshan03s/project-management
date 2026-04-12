'use client'

import PageWrapper from '@/components/page-wrapper'
import { Button } from '@/components/ui/button'
import { Google } from '@/components/ui/svgs/google'
import { authClient } from '@/lib/auth-client'

export default function Page() {
  async function handleSignIn() {
    await authClient.signIn.social({
      provider: 'google'
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
