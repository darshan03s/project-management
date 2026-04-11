'use client'

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
    <div className="h-[calc(100vh-48px)] w-full flex items-center justify-center">
      <Button className="flex items-center gap-3" onClick={handleSignIn}>
        <Google /> Sign in with Google
      </Button>
    </div>
  )
}
