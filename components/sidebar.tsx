'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button, buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowDown01Icon, Login01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { Project } from '@/types'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { authClient } from '@/lib/auth-client'
import { Skeleton } from './ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

const ProjectsList = ({ projects }: { projects: Project[] }) => {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'w-full flex items-center justify-between'
        )}
      >
        Projects
        <HugeiconsIcon icon={ArrowDown01Icon} />
      </CollapsibleTrigger>
      <CollapsibleContent className="text-sm ml-3 border-l-2 flex flex-col gap-2">
        {projects?.map((project) => {
          return (
            <Link href={`/project/${project.id}`} key={project.id} className="pl-4 truncate">
              {project.name}
            </Link>
          )
        })}
      </CollapsibleContent>
    </Collapsible>
  )
}

const User = () => {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()

  if (isPending) {
    return <Skeleton className="w-full h-8 rounded-md" />
  }

  if (!isPending && !data) {
    return (
      <Button>
        <HugeiconsIcon icon={Login01Icon} /> Sign in
      </Button>
    )
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 focus-visible:outline-none">
        <Image
          src={data!.user.image!}
          alt="User logo"
          width={500}
          height={500}
          className="w-6 h-6"
        />
        <div className="flex flex-col text-xs text-left">
          <span className="font-bold">{data!.user.name}</span>
          <span className="text-[10px] truncate">{data!.user.email}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <HugeiconsIcon icon={Logout01Icon} />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Sidebar() {
  const { data: projects, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const res = await fetch('/api/projects', {
        cache: 'no-store'
      })

      if (!res.ok) {
        toast.error('Failed to fetch projects')
      }

      const json = await res.json()
      return json.data
    }
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const pathname = usePathname()

  if (pathname === '/sign-in') return null

  return (
    <aside className="h-[calc(100vh-48px)] bg-secondary text-secondary-foreground w-60 flex flex-col">
      <div className="p-2 pb-0 overflow-y-auto flex-1">
        <ProjectsList projects={projects ?? []} />
      </div>

      <div className="p-2 border-t">
        <User />
      </div>
    </aside>
  )
}
