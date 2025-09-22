import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, PlusCircle } from "lucide-react";
import Link from "next/link";

// Mock data for user's projects
const projects = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles common customer queries and escalates issues.",
  },
  {
    id: "2",
    name: "Story Writer Agent",
    description: "Generates creative short stories based on prompts.",
  },
  {
    id: "3",
    name: "Code Assistant",
    description: "Helps with boilerplate code, debugging, and algorithms.",
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here are your agents.
          </p>
        </div>
        <Button asChild>
          <Link href="/project/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Agent
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>{project.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/project/${project.id}`}>Open Chat</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        <Card className="border-dashed flex items-center justify-center min-h-[260px]">
          <Button
            variant="ghost"
            asChild
            className="flex flex-col h-full w-full gap-2 text-center"
          >
            <Link href="/project/new">
              <PlusCircle className="h-8 w-8 text-muted-foreground" />
              <span className="text-muted-foreground">Create New Agent</span>
            </Link>
          </Button>
        </Card>
      </div>
    </AppLayout>
  );
}
