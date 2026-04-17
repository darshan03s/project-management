'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import { usePathname, useRouter } from 'next/navigation'
import Brand from './brand'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowUp01Icon, ChevronDown, Login01Icon, Logout01Icon } from '@hugeicons/core-free-icons'
import { useQuery } from '@tanstack/react-query'
import { Project } from '@/types'
import { toast } from 'sonner'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { authClient } from '@/lib/auth-client'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import Image from 'next/image'

const ProjectsList = ({ projects }: { projects: Project[] }) => {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={'Projects'}>
                <span>Projects</span>
                <HugeiconsIcon
                  icon={ChevronDown}
                  className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {projects.map((project) => (
                  <SidebarMenuSubItem key={project.id}>
                    <SidebarMenuSubButton asChild>
                      <Link href={`/project/${project.id}`}>{project.name}</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}

const UserAvatar = ({ image, name }: { image: string | null | undefined; name: string }) => {
  return (
    <Avatar className="relative h-8 w-8 rounded-lg overflow-hidden">
      {image ? (
        <Image src={image} alt={name} className="object-cover" width={500} height={500} />
      ) : (
        <AvatarFallback className="rounded-lg">
          {name
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </AvatarFallback>
      )}
    </Avatar>
  )
}

const User = () => {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()
  const { isMobile } = useSidebar()

  if (isPending) {
    return <Skeleton className="w-full h-8 rounded-md" />
  }

  if (!isPending && !data) {
    return (
      <Button className="w-fu">
        <HugeiconsIcon icon={Login01Icon} /> Sign in
      </Button>
    )
  }

  const user = data!.user

  console.log('image', user.image)

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar image={user.image} name={user.name} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <HugeiconsIcon icon={ArrowUp01Icon} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-1 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <UserAvatar image={user.image} name={user.name} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Button variant={'ghost'} className="w-full" onClick={handleSignOut}>
                  <HugeiconsIcon icon={Logout01Icon} /> Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar() {
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
      return json.data.projects
    }
  })

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error])

  const pathname = usePathname()

  if (pathname.startsWith('/sign-in') || pathname.startsWith('/invite')) return null

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between">
        <SidebarTrigger className="opacity-30 hover:opacity-80 transition-opacity duration-200" />
        <Brand className="pr-2" />
      </SidebarHeader>
      <SidebarContent>
        <ProjectsList projects={projects ?? []} />
      </SidebarContent>
      <SidebarFooter>
        <User />
      </SidebarFooter>
    </Sidebar>
  )
}
