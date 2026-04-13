import { ProjectWithOwner } from '@/types'
import { create } from 'zustand'

interface ProjectStore {
  project: ProjectWithOwner | null
}

export const useProjectStore = create<ProjectStore>(() => ({
  project: null
}))
