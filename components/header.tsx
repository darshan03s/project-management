import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

export default function Header() {
  return (
    <header className="h-12 w-full flex items-center justify-between px-4 bg-secondary text-secondary-foreground">
      <div className="header-left text-xs sm:text-sm">
        <Link href={'/'}>Project management</Link>
      </div>
      <div className="header-right">
        <ModeToggle />
      </div>
    </header>
  )
}
