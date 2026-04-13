import { ProjectWithAdmin } from '@/types'
import { create } from 'zustand'

interface ProjectStore {
  project: ProjectWithAdmin | null
}

export const useProjectStore = create<ProjectStore>(() => ({
  project: null
}))
