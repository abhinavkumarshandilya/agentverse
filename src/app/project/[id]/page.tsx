import AppLayout from "@/components/layout/app-layout";
import { ChatInterface } from "@/components/chat/chat-interface";

export default function ProjectChatPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch project details by its ID from a database.
  // For this mock, we'll generate a name based on the ID.
  const project = { id: params.id, name: `Agent Chat ${params.id}` };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-10rem)] max-w-4xl mx-auto">
        <ChatInterface project={project} />
      </div>
    </AppLayout>
  );
}
