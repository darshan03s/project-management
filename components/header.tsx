'use client'

import { ModeToggle } from './mode-toggle'
import CreateProject from './create-project'
import Brand from './brand'
import { SidebarTrigger, useSidebar } from './ui/sidebar'

export default function Header() {
  const { state } = useSidebar()

  return (
    <header className="h-12 w-full flex items-center justify-between px-4 sticky z-10 top-0 left-0">
      <div className="header-left text-xs sm:text-sm">
        {state === 'collapsed' && (
          <div className="flex items-center gap-2">
            <SidebarTrigger className="opacity-30 hover:opacity-80 transition-opacity duration-200" />
            <Brand />
          </div>
        )}
      </div>
      <div className="header-right flex items-center gap-3">
        <CreateProject />
        <ModeToggle />
      </div>
    </header>
  )
}
