import { useProjectStore } from '@/stores/project-store'
import Link from 'next/link'

export default function ProjectInfo() {
  const project = useProjectStore((s) => s.project)

  return (
    <div className="grid grid-cols-4 gap-4 h-[76vh]">
      <div className="col-span-3 bg-secondary p-4 rounded-md">{project?.description}</div>
      <div className="col-span-1 bg-secondary p-4 rounded-md">
        <div className="flex flex-col">
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
