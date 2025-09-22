"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { generateAgentResponse } from "@/ai/flows/generate-agent-response";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type Message = {
  id: number;
  text: string | React.ReactNode;
  sender: "user" | "bot";
};

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export function ChatInterface({ project }: { project: { id: string; name: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: 1,
        text: `Hello! I'm the agent for "${project.name}". How can I assist you today?`,
        sender: 'bot'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const onSubmit = async (values: z.infer<typeof chatSchema>) => {
    const userMessage: Message = {
      id: Date.now(),
      text: values.message,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    setIsLoading(true);

    try {
      const response = await generateAgentResponse({ prompt: values.message });
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.response,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Error generating agent response:", error);
      
      let errorMessageText: React.ReactNode = "Sorry, I encountered an error. Please try again later.";
      let toastDescription = "Could not get a response from the agent.";

      if (error.message?.includes("API key not valid") || error.message?.includes("GEMINI_API_KEY")) {
        errorMessageText = (
          <span>
            The Gemini API key is either missing or invalid. Please go to{" "}
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/settings">Settings</Link>
            </Button>{" "}
            to add a valid key.
          </span>
        );
        toastDescription = "Invalid or missing Gemini API key.";
      }

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: errorMessageText,
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: toastDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{project.name}</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-4",
                message.sender === "user" && "justify-end"
              )}
            >
              {message.sender === "bot" && (
                <Avatar className="border">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg p-3 max-w-[75%]",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <div className="text-sm whitespace-pre-wrap">{message.text}</div>
              </div>
              {message.sender === "user" && (
                <Avatar className="border">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="border">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-foreground rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t bg-background">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <Input
            {...form.register("message")}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
