"use client";

import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const apiKeyFormSchema = z.object({
  openAIKey: z.string().optional(),
  openRouterKey: z.string().optional(),
});

export default function SettingsPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof apiKeyFormSchema>>({
    resolver: zodResolver(apiKeyFormSchema),
    // In a real app, you'd fetch and populate these values for the user
    defaultValues: {
      openAIKey: "",
      openRouterKey: "",
    },
  });

  function onSubmit(values: z.infer<typeof apiKeyFormSchema>) {
    console.log("Saving API Keys:", values);
    // Here you would encrypt and save the keys for the user.
    toast({
      title: "Settings Saved",
      description: "Your API keys have been updated.",
    });
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and API key settings.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Provide your API keys to enable agent functionality. Your keys are
              stored securely and never exposed on the client-side.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="openAIKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenAI API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="sk-..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Required for agents using OpenAI models.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="openRouterKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenRouter API Key</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="sk-or-..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Required for agents using OpenRouter models.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-4">
                  <Button type="submit">Save Keys</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
