import { useProjectStore } from '@/stores/project-store'
import Link from 'next/link'

export default function ProjectInfo() {
  const project = useProjectStore((s) => s.project)

  return (
    <div className="grid grid-cols-4 gap-4 h-[75vh] max-h-[75vh]">
      <div className="col-span-3 bg-secondary p-4 rounded-md flex flex-col min-h-0">
        <div className="project-description-header">
          <span className="opacity-50">Description</span>
        </div>
        <div className="overflow-y-scroll min-h-0 flex-1 hide-scrollbar">
          {project?.description}
        </div>
      </div>
      <div className="col-span-1 bg-secondary p-4 rounded-md space-y-4">
        <div className="info-piece flex flex-col">
          <span className="font-bold">Owner</span>
          <span>{project?.owner.name}</span>
        </div>
        <div className="info-piece flex flex-col">
          <span className="font-bold">Github</span>
          {project?.githubLink ? (
            <Link target="_blank" href={project?.githubLink} className="underline">
              {project?.githubLink}
            </Link>
          ) : (
            <span>Not available</span>
          )}
        </div>
      </div>
    </div>
  )
}
