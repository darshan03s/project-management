import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import UserSignIn from './user-sign-in'

export default function Header() {
  return (
    <header className="h-12 w-full flex items-center justify-between px-4 bg-secondary text-secondary-foreground sticky z-10 top-0 left-0">
      <div className="header-left text-xs sm:text-sm">
        <Link href={'/'}>Project management</Link>
      </div>
      <div className="header-right flex items-center gap-3">
        <UserSignIn />
        <ModeToggle />
      </div>
    </header>
  )
}
