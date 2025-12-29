"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Input, 
  Label, 
  Textarea 
} from "@/components/ui";
import { Navbar, Sidebar } from "@/components/shared";
import { useCreateKnowledgeBase } from "@/lib/hooks";

export default function NewKnowledgeBasePage() {
  const router = useRouter();
  const createMutation = useCreateKnowledgeBase();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    const kb = await createMutation.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    
    router.push(`/knowledge-bases/${kb.id}`);
  };

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/knowledge-bases"
              className="inline-flex items-center gap-1 text-sm text-silver-500 hover:text-palkia-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Knowledge Bases
            </Link>
          </div>

          <Card className="card-palkia">
            <CardHeader>
              <CardTitle>Create New Knowledge Base</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., AI Research, Business Strategy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What topics will this knowledge base cover?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/knowledge-bases")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    disabled={!name.trim() || createMutation.isPending}
                  >
                    {createMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Knowledge Base
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
