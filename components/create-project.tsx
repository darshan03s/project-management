'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Loading, Plus } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Button, buttonVariants } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateProjectFormValues, createProjectSchema } from '@/lib/zod-schemas/project'
import { createProjectAction } from '@/actions/project'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CreateProject() {
  const [open, setOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema)
  })

  const onSubmit = async (data: CreateProjectFormValues) => {
    const res = await createProjectAction(data)
    if (res.success) {
      toast.success('Project created successfully')
      setOpen(false)
    } else {
      toast.error(`Project could not be created\n${res.error}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={() => setOpen(true)}
        className={cn(buttonVariants({ variant: 'default' }), 'flex items-center gap-2')}
      >
        <HugeiconsIcon icon={Plus} /> Create Project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Project name" {...register('name')} />
            {errors.name && (
              <span className="pt-1 text-destructive text-[10px]">{errors.name.message}</span>
            )}
          </div>
          <div>
            <Textarea placeholder="Project description" {...register('description')} />
            {errors.description && (
              <span className="pt-1 text-destructive text-[10px]">
                {errors.description.message}
              </span>
            )}
          </div>
          <div>
            <Input placeholder="Github link" {...register('githubLink')} />
            {errors.githubLink && (
              <span className="pt-1 text-destructive text-[10px]">{errors.githubLink.message}</span>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="disabled:opacity-50">
              {isSubmitting && <HugeiconsIcon icon={Loading} className="animate-spin" />} Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
