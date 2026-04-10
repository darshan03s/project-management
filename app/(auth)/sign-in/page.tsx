import { Button } from '@/components/ui/button'
import { Google } from '@/components/ui/svgs/google'

export default function Page() {
  return (
    <main className="flex-1 flex items-center justify-center">
      <Button className="flex items-center gap-3">
        <Google /> Sign in with Google
      </Button>
    </main>
  )
}
