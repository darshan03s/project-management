import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import UserSignIn from './user-sign-in'
import { HugeiconsIcon } from '@hugeicons/react'
import { TimeManagementIcon } from '@hugeicons/core-free-icons'

export default function Header() {
  return (
    <header className="h-12 w-full flex items-center justify-between px-4 sticky z-10 top-0 left-0">
      <div className="header-left text-xs sm:text-sm">
        <Link href={'/'} className="flex items-center gap-2">
          <HugeiconsIcon icon={TimeManagementIcon} />
          Project management
        </Link>
      </div>
      <div className="header-right flex items-center gap-3">
        <UserSignIn />
        <ModeToggle />
      </div>
    </header>
  )
}
