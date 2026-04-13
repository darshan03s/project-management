import { ProjectWithAdmin } from '@/types'
import { create } from 'zustand'

interface ProjectStore {
  project: ProjectWithAdmin | null
  isAdmin: boolean
}

export const useProjectStore = create<ProjectStore>(() => ({
  project: null,
  isAdmin: false
}))
