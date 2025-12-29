"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Database, 
  Video, 
  Search, 
  ArrowUpDown,
  Loader2,
  MoreHorizontal,
  Trash2,
  Edit
} from "lucide-react";
import { 
  Button, 
  Card, 
  CardContent, 
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Textarea,
} from "@/components/ui";
import { Navbar, Sidebar } from "@/components/shared";
import { useKnowledgeBases, useCreateKnowledgeBase, useDeleteKnowledgeBase } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import type { KnowledgeBase } from "@/types";

type SortField = "name" | "created_at" | "video_count" | "source_count";
type SortOrder = "asc" | "desc";

export default function KnowledgeBasesPage() {
  const { data: knowledgeBases, isLoading, error } = useKnowledgeBases();
  const createMutation = useCreateKnowledgeBase();
  const deleteMutation = useDeleteKnowledgeBase();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKBName, setNewKBName] = useState("");
  const [newKBDescription, setNewKBDescription] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const filteredAndSorted = (knowledgeBases || [])
    .filter((kb) => 
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kb.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let aVal: string | number = a[sortField] ?? "";
      let bVal: string | number = b[sortField] ?? "";
      
      if (sortField === "created_at") {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleCreateKB = async () => {
    if (!newKBName.trim()) return;
    
    await createMutation.mutateAsync({
      name: newKBName.trim(),
      description: newKBDescription.trim() || null,
    });
    
    setNewKBName("");
    setNewKBDescription("");
    setIsCreateDialogOpen(false);
  };

  const handleDeleteKB = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    setDeleteConfirmId(null);
  };

  const kbToDelete = knowledgeBases?.find(kb => kb.id === deleteConfirmId);

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-silver-900 dark:text-silver-100">
                Knowledge Bases
              </h1>
              <p className="mt-1 text-silver-500 dark:text-silver-400">
                Manage your intelligence extraction sources
              </p>
            </div>
            <Button 
              variant="gradient" 
              className="gap-2"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              New Knowledge Base
            </Button>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-400" />
              <Input
                placeholder="Search knowledge bases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-silver-500">Sort by:</span>
              <div className="flex gap-1">
                {([
                  { field: "name", label: "Name" },
                  { field: "created_at", label: "Date" },
                  { field: "video_count", label: "Videos" },
                ] as const).map(({ field, label }) => (
                  <Button
                    key={field}
                    variant={sortField === field ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => handleSort(field)}
                    className="gap-1"
                  >
                    {label}
                    {sortField === field && (
                      <ArrowUpDown className="h-3 w-3" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-palkia-500" />
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="py-6">
                <p className="text-center text-red-700 dark:text-red-400">
                  Failed to load knowledge bases. Is the backend running?
                </p>
              </CardContent>
            </Card>
          ) : filteredAndSorted.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAndSorted.map((kb) => (
                <KBCard 
                  key={kb.id} 
                  kb={kb} 
                  onDelete={() => setDeleteConfirmId(kb.id)}
                />
              ))}
            </div>
          ) : knowledgeBases && knowledgeBases.length > 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <Search className="mx-auto h-12 w-12 text-silver-300" />
                  <h3 className="mt-4 text-lg font-medium text-silver-900 dark:text-silver-100">
                    No results found
                  </h3>
                  <p className="mt-1 text-sm text-silver-500">
                    Try adjusting your search query
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-palkia-100 dark:bg-palkia-900/30">
                    <Database className="h-6 w-6 text-palkia-600 dark:text-palkia-400" />
                  </div>
                  <h3 className="text-lg font-medium text-silver-900 dark:text-silver-100">
                    No knowledge bases yet
                  </h3>
                  <p className="mt-1 text-sm text-silver-500">
                    Create your first knowledge base to start extracting intelligence
                  </p>
                  <Button 
                    variant="gradient" 
                    className="mt-4"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Knowledge Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Knowledge Base</DialogTitle>
            <DialogDescription>
              A knowledge base is a collection of YouTube sources for intelligence extraction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., AI Research, Business Strategy"
                value={newKBName}
                onChange={(e) => setNewKBName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateKB()}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What topics will this knowledge base cover?"
                value={newKBDescription}
                onChange={(e) => setNewKBDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="gradient"
              onClick={handleCreateKB}
              disabled={!newKBName.trim() || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Knowledge Base</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{kbToDelete?.name}"? This action cannot be undone.
              All sources, videos, and extracted intelligence will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => deleteConfirmId && handleDeleteKB(deleteConfirmId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function KBCard({ kb, onDelete }: { kb: KnowledgeBase; onDelete: () => void }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="card-palkia h-full group relative">
      <div className="absolute right-2 top-2 z-10">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-silver-200 bg-white shadow-lg dark:border-silver-700 dark:bg-silver-800 py-1 z-50">
                <Link 
                  href={`/knowledge-bases/${kb.id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-silver-100 dark:hover:bg-silver-700"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(false);
                    onDelete();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Link href={`/knowledge-bases/${kb.id}`}>
        <CardContent className="pt-6">
          <div className="mb-4 pr-8">
            <h3 className="font-semibold text-silver-900 dark:text-silver-100">
              {kb.name}
            </h3>
            <p className="mt-1 text-sm text-silver-500 line-clamp-2">
              {kb.description || "No description"}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Video className="h-4 w-4 text-palkia-500" />
              <span className="text-silver-600 dark:text-silver-400">
                {kb.video_count} videos
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="h-4 w-4 text-pearl-500" />
              <span className="text-silver-600 dark:text-silver-400">
                {kb.source_count} sources
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Badge variant="palkia">Ready</Badge>
            <span className="text-xs text-silver-400">
              {formatDate(kb.created_at)}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
