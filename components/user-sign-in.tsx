'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { authClient } from '@/lib/auth-client'
import { usePathname, useRouter } from 'next/navigation'
import { Button, buttonVariants } from './ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Loading03Icon, Login01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function UserSignIn() {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  const pathname = usePathname()

  if (pathname === '/sign-in') return null

  return (
    <div>
      {isPending ? (
        <Button variant={'outline'}>
          <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        </Button>
      ) : data ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'cursor-pointer')}
          >
            <Image src={data.user.image!} width={500} height={500} alt="User Image" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-50">
            <DropdownMenuItem className="flex flex-col items-start">
              <span className="font-bold">{data.user.name}</span>
              <span className="text-xs">{data.user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
              <HugeiconsIcon icon={Logout01Icon} />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={'/sign-in'} className={cn(buttonVariants({ variant: 'default' }))}>
          <HugeiconsIcon icon={Login01Icon} />
          Sign In
        </Link>
      )}
    </div>
  )
}
