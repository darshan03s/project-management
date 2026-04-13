import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function Brand({ className }: { className?: string }) {
  return (
    <Link href={'/'} className={cn('flex items-center gap-2 text-sm', className)}>
      Prjx
    </Link>
  )
}
