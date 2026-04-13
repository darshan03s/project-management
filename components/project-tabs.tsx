import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProjectInfo from './project-info'

export default function ProjectTabs() {
  return (
    <Tabs defaultValue="info" className="">
      <TabsList className="flex gap-4 bg-background">
        <TabsTrigger value="info">Info</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="board">Board</TabsTrigger>
      </TabsList>
      <TabsContent value="info">
        <ProjectInfo />
      </TabsContent>
      <TabsContent value="members">Todo</TabsContent>
      <TabsContent value="tasks">Todo</TabsContent>
      <TabsContent value="board">Todo</TabsContent>
    </Tabs>
  )
}
