import { cn } from '@/lib/utils'
import { ComponentProps, ReactNode } from 'react'

export default function PageWrapper({
  children,
  className,
  ...props
}: ComponentProps<'div'> & { children: ReactNode }) {
  return (
    <div className={cn('h-[calc(100vh-48px)]', className)} {...props}>
      {children}
    </div>
  )
}
