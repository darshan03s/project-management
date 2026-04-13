import { Project } from '@/types'
import { create } from 'zustand'

interface ProjectStore {
  project: Project | null
}

export const useProjectStore = create<ProjectStore>(() => ({
  project: null
}))
