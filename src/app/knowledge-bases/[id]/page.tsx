"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus, 
  Play, 
  Video, 
  Database,
  Lightbulb,
  Users,
  Loader2,
  ExternalLink,
  Youtube,
  ListVideo,
  User,
  Clock,
  AlertCircle,
  RefreshCw,
  Trash2,
  Filter,
  Pencil,
} from "lucide-react";
import { 
  Button, 
  Card, 
  CardContent, 
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Label,
  Input,
  Progress,
  Skeleton,
  Textarea,
} from "@/components/ui";
import { Navbar, Sidebar } from "@/components/shared";
import { MediaProgressBar } from "@/components/shared/media-status-card";
import { 
  useKnowledgeBase, 
  useSources, 
  useMedia, 
  useConcepts, 
  useEntities,
  useAddSource,
  useExtractionStatus,
  useDeleteKnowledgeBase,
  useUpdateKnowledgeBase,
  useDeleteSource,
  useSourceIngestionStatus,
  useRetryMedia,
} from "@/lib/hooks";
import { formatDate, formatDuration, formatTimestamp, detectYouTubeSourceType } from "@/lib/utils";
import type { Source, MediaContent } from "@/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function KnowledgeBaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: kb, isLoading: kbLoading } = useKnowledgeBase(id);
  const { data: sources } = useSources(id);
  const { data: mediaItems } = useMedia(id);
  const { data: extractionStatus } = useExtractionStatus(id);
  
  const addSourceMutation = useAddSource();
  const deleteMutation = useDeleteKnowledgeBase();
  const updateMutation = useUpdateKnowledgeBase();
  const deleteSourceMutation = useDeleteSource();
  
  const [activeTab, setActiveTab] = useState("sources");
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const detectedSourceType = sourceUrl ? detectYouTubeSourceType(sourceUrl) : null;
  
  const handleAddSource = async () => {
    if (!sourceUrl.trim()) return;
    
    await addSourceMutation.mutateAsync({
      kbId: id,
      data: { url: sourceUrl.trim() },
    });
    
    setSourceUrl("");
    setIsAddSourceOpen(false);
  };

  const handleDelete = async () => {
    router.push("/knowledge-bases");
    deleteMutation.mutate(id);
  };

  const handleDeleteSource = async (sourceId: string) => {
    await deleteSourceMutation.mutateAsync({ sourceId, kbId: id });
  };

  const handleOpenEditDialog = () => {
    setEditName(kb?.name || "");
    setEditDescription(kb?.description || "");
    setIsEditDialogOpen(true);
  };

  const handleUpdateKnowledgeBase = async () => {
    if (!editName.trim()) return;
    
    await updateMutation.mutateAsync({
      id,
      data: { 
        name: editName.trim(), 
        description: editDescription.trim() || null 
      },
    });
    
    setIsEditDialogOpen(false);
  };

  if (kbLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Sidebar />
        <main className="lg:pl-64 pt-16">
          <div className="p-6 lg:p-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </main>
      </div>
    );
  }

  if (!kb) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Sidebar />
        <main className="lg:pl-64 pt-16">
          <div className="p-6 lg:p-8">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="py-6">
                <p className="text-center text-red-700 dark:text-red-400">
                  Knowledge base not found
                </p>
                <div className="mt-4 text-center">
                  <Link href="/knowledge-bases">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Knowledge Bases
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <Link 
              href="/knowledge-bases"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-palkia-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Knowledge Bases
            </Link>
          </div>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {kb.name}
                </h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenEditDialog}
                  className="h-8 w-8 text-muted-foreground hover:text-palkia-500"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-muted-foreground">
                {kb.description || "No description"}
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  {sources?.length || 0} sources
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {extractionStatus?.entities_extracted || 0} entities
                </span>
                <span className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  {extractionStatus?.concepts_extracted || 0} concepts
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="default" 
                onClick={() => setIsAddSourceOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Source
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <StatCard 
              title="Sources" 
              value={sources?.length || 0} 
              icon={Database}
              color="palkia"
            />
            <StatCard 
              title="Media" 
              value={mediaItems?.length || 0} 
              icon={Video}
              color="pearl"
            />
            <StatCard 
              title="Concepts" 
              value={extractionStatus?.concepts_extracted || 0} 
              icon={Lightbulb}
              color="palkia"
            />
            <StatCard 
              title="Entities" 
              value={extractionStatus?.entities_extracted || 0} 
              icon={Users}
              color="pearl"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-white/50 dark:bg-black/20 p-1 rounded-xl">
              <TabsTrigger value="sources" className="rounded-lg">Sources</TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg">Media</TabsTrigger>
              <TabsTrigger value="concepts" className="rounded-lg">Concepts</TabsTrigger>
              <TabsTrigger value="entities" className="rounded-lg">Entities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <SourcesTab 
                sources={sources || []} 
                mediaItems={mediaItems || []}
                kbId={id}
                onAddSource={() => setIsAddSourceOpen(true)} 
                onDeleteSource={handleDeleteSource}
                isDeletingSource={deleteSourceMutation.isPending}
              />
            </TabsContent>
            
            <TabsContent value="media">
              <MediaTab mediaItems={mediaItems || []} kbId={id} />
            </TabsContent>

            <TabsContent value="concepts">
              <ConceptsTab kbId={id} mediaItems={mediaItems || []} />
            </TabsContent>
            
            <TabsContent value="entities">
              <EntitiesTab kbId={id} mediaItems={mediaItems || []} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={isAddSourceOpen} onOpenChange={setIsAddSourceOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add YouTube Source</DialogTitle>
            <DialogDescription>
              Paste a YouTube channel, playlist, or video URL to add as a source.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">YouTube URL</Label>
              <Input
                id="url"
                placeholder="https://youtube.com/@channel or playlist or video URL"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSource()}
              />
            </div>
            
            {detectedSourceType && detectedSourceType !== "unknown" && (
              <div className="flex items-center gap-2 rounded-lg bg-palkia-50 dark:bg-palkia-900/20 p-3">
                {detectedSourceType === "channel" && <User className="h-5 w-5 text-palkia-500" />}
                {detectedSourceType === "playlist" && <ListVideo className="h-5 w-5 text-palkia-500" />}
                {detectedSourceType === "video" && <Youtube className="h-5 w-5 text-palkia-500" />}
                <div>
                  <p className="text-sm font-medium text-palkia-700 dark:text-palkia-300">
                    Detected: YouTube {detectedSourceType.charAt(0).toUpperCase() + detectedSourceType.slice(1)}
                  </p>
                  <p className="text-xs text-palkia-600 dark:text-palkia-400">
                    {detectedSourceType === "channel" && "All videos from this channel will be imported"}
                    {detectedSourceType === "playlist" && "All videos from this playlist will be imported"}
                    {detectedSourceType === "video" && "This single video will be imported"}
                  </p>
                </div>
              </div>
            )}
            
            {detectedSourceType === "unknown" && sourceUrl && (
              <div className="flex items-center gap-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Could not detect source type. Please check the URL.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSourceOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleAddSource}
              disabled={!sourceUrl.trim() || detectedSourceType === "unknown" || addSourceMutation.isPending}
            >
              {addSourceMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Add Source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Knowledge Base</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{kb?.name}"? This action cannot be undone.
              All sources, media, and extracted intelligence will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Knowledge Base</DialogTitle>
            <DialogDescription>
              Update the name and description of this knowledge base.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Knowledge base name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="default"
              onClick={handleUpdateKnowledgeBase}
              disabled={!editName.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: number; 
  icon: React.ComponentType<{ className?: string }>; 
  color: "palkia" | "pearl";
}) {
  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color === "palkia" ? "text-palkia-500" : "text-muted-foreground"}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function SourcesTab({ 
  sources, 
  mediaItems,
  kbId,
  onAddSource,
  onDeleteSource,
  isDeletingSource
}: { 
  sources: Source[]; 
  mediaItems: MediaContent[];
  kbId: string;
  onAddSource: () => void;
  onDeleteSource: (sourceId: string) => void;
  isDeletingSource: boolean;
}) {
  const mediaBySourceId = useMemo(() => {
    const map: Record<string, MediaContent[]> = {};
    for (const item of mediaItems) {
      if (item.source_id) {
        (map[item.source_id] ??= []).push(item);
      }
    }
    return map;
  }, [mediaItems]);

  if (sources.length === 0) {
    return (
      <Card className="border-dashed glass-card">
        <CardContent className="py-12">
          <div className="text-center">
            <Youtube className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No sources yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add YouTube channels, playlists, or videos as sources
            </p>
            <Button variant="default" className="mt-4" onClick={onAddSource}>
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sources.map((source) => (
        <SourceCard 
          key={source.id} 
          source={source} 
          mediaItems={mediaBySourceId[source.id] ?? []}
          kbId={kbId}
          onDelete={() => onDeleteSource(source.id)}
          isDeleting={isDeletingSource}
        />
      ))}
    </div>
  );
}

function SourceCard({ 
  source, 
  mediaItems, 
  kbId,
  onDelete,
  isDeleting
}: { 
  source: Source; 
  mediaItems: MediaContent[]; 
  kbId: string;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: ingestionStatus } = useSourceIngestionStatus(source.id, kbId);
  
  const isMetadataLoading = !source.title;

  const stats = useMemo(() => {
    return {
      total: mediaItems.length,
      pending: mediaItems.filter(v => v.status === "pending").length,
      downloading: mediaItems.filter(v => v.status === "downloading").length,
      transcribing: mediaItems.filter(v => v.status === "transcribing").length,
      processing: mediaItems.filter(v => v.status === "processing").length,
      extracting: mediaItems.filter(v => v.status === "extracting").length,
      completed: mediaItems.filter(v => v.status === "completed").length,
      failed: mediaItems.filter(v => v.status === "failed").length,
    };
  }, [mediaItems]);

  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const handleDelete = () => {
    onDelete();
    setDeleteStep(0);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteStep(0);
  };

  const getIngestionMessage = () => {
    if (isMetadataLoading) return "Fetching metadata...";
    if (!ingestionStatus) return null;
    return ingestionStatus.message;
  };

  const ingestionMessage = getIngestionMessage();
  const isActive = ingestionStatus && ["processing", "extracting", "fetching_metadata"].includes(ingestionStatus.status);
  const showIngestionStatus = isMetadataLoading || isActive;
  
  return (
    <>
      <Card className="glass-card flex flex-col h-full transition-all duration-300">
        <CardContent className="pt-6 flex-1">
          <div className="flex items-start gap-3 mb-4">
            <div className="rounded-lg bg-palkia-100 dark:bg-palkia-900/30 p-2 shrink-0">
              {source.source_type === "youtube_channel" && <User className="h-5 w-5 text-palkia-500" />}
              {source.source_type === "youtube_playlist" && <ListVideo className="h-5 w-5 text-palkia-500" />}
              {source.source_type === "youtube_video" && <Youtube className="h-5 w-5 text-palkia-500" />}
            </div>
            <div className="flex-1 min-w-0">
              {isMetadataLoading ? (
                <>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </>
              ) : (
                <>
                  <h4 className="font-medium text-foreground truncate" title={source.title || "Untitled Source"}>
                    {source.title || "Untitled Source"}
                  </h4>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground truncate block hover:text-palkia-500"
                  >
                    {source.url}
                  </a>
                </>
              )}
              <div className="mt-2 text-xs text-muted-foreground">
                Added {formatDate(source.created_at)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteStep(1)}
              className="text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {showIngestionStatus && ingestionMessage && (
            <div className="mb-3 flex items-center gap-2 text-sm text-palkia-600 dark:text-palkia-400 bg-palkia-50 dark:bg-palkia-900/20 rounded-lg px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{ingestionMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {stats.completed} / {stats.total} completed
              </span>
            </div>
            
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex flex-wrap gap-2 text-xs">
              {stats.pending > 0 && (
                <Badge variant="outline" className="text-muted-foreground border-border">
                  {stats.pending} Pending
                </Badge>
              )}
              {stats.downloading > 0 && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700 animate-pulse border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                  {stats.downloading} Downloading
                </Badge>
              )}
              {stats.transcribing > 0 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-700 animate-pulse border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                  {stats.transcribing} Transcribing
                </Badge>
              )}
              {stats.processing > 0 && (
                <Badge variant="outline" className="bg-purple-100 text-purple-700 animate-pulse border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                  {stats.processing} Processing
                </Badge>
              )}
              {stats.extracting > 0 && (
                <Badge variant="outline" className="bg-pink-100 text-pink-700 animate-pulse border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800">
                  {stats.extracting} Extracting
                </Badge>
              )}
              {stats.completed > 0 && (
                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                  {stats.completed} Completed
                </Badge>
              )}
              {stats.failed > 0 && (
                <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 hover:text-red-700">
                  {stats.failed} Failed
                </Badge>
              )}
            </div>

            {mediaItems.length > 0 && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {isExpanded ? "Hide Media" : "Show Media"}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {isExpanded && (
                  <div className="mt-3 space-y-3 border-t border-border pt-3 animate-in slide-in-from-top-2 duration-200">
                    {mediaItems.map((item) => (
                      <MediaItemCard key={item.id} item={item} kbId={kbId} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteStep === 1} onOpenChange={(open) => !open && setDeleteStep(0)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{source.title || "this source"}"? 
              This will also delete all {stats.total} associated media items and their extracted data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => setDeleteStep(2)}
            >
              Yes, delete this source
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteStep === 2} onOpenChange={(open) => !open && setDeleteStep(0)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">⚠️ Final Confirmation</DialogTitle>
            <DialogDescription>
              This action is <strong>permanent and cannot be undone</strong>. 
              All {stats.total} media items, transcripts, and extracted intelligence will be lost forever.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function MediaItemCard({ item, kbId }: { item: MediaContent; kbId: string }) {
  const retryMutation = useRetryMedia();

  return (
    <div className="group rounded-xl border border-border p-4 bg-card/60 dark:bg-card/40 backdrop-blur-sm hover:bg-card/80 dark:hover:bg-card/60 transition-colors shadow-sm">
      <div className="flex gap-4 items-center">
        {item.thumbnail_url ? (
          <div className="relative shrink-0 self-center">
            <img 
              src={item.thumbnail_url} 
              alt={item.title}
              className="h-16 w-28 rounded-md object-cover border border-border"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity rounded-md">
              <Play className="h-5 w-5 text-white fill-white" />
            </div>
          </div>
        ) : (
          <div className="h-16 w-28 shrink-0 self-center rounded-md bg-muted flex items-center justify-center border border-border">
            <Video className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <h5 className="text-sm font-medium text-foreground truncate" title={item.title}>
              {item.title}
            </h5>
            <div className="flex items-center gap-1 shrink-0">
              {item.status === "failed" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => retryMutation.mutateAsync({ kbId, mediaId: item.id })}
                  disabled={retryMutation.isPending}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <RefreshCw className={`h-3 w-3 ${retryMutation.isPending ? "animate-spin" : ""}`} />
                </Button>
              )}
              {item.platform === "youtube" && (
                <a 
                  href={`https://youtube.com/watch?v=${item.remote_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-palkia-500 p-1"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 mb-1.5">
            {item.duration_seconds && (
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" />
                {formatDuration(item.duration_seconds)}
              </span>
            )}
          </div>
          
          <MediaProgressBar status={item.status} progress={item.progress} />
          
          {item.status === "failed" && item.error_message && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded px-2 py-1 truncate" title={item.error_message}>
              {item.error_message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MediaTab({ mediaItems, kbId }: { mediaItems: MediaContent[]; kbId: string }) {
  const safeItems = Array.isArray(mediaItems) ? mediaItems : [];

  if (safeItems.length === 0) {
    return (
      <Card className="border-dashed glass-card">
        <CardContent className="py-12">
          <div className="text-center">
            <Video className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No media found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Media will appear here after adding sources
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {safeItems.map((item) => (
        <MediaItemCard key={item.id} item={item} kbId={kbId} />
      ))}
    </div>
  );
}

function ConceptsTab({ kbId, mediaItems }: { kbId: string; mediaItems: MediaContent[] }) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const [mediaId, setMediaId] = useState<string>("all");
  const limit = 20;
  
  const { data, isLoading } = useConcepts(kbId, page, limit, type, mediaId);
  const concepts = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (concepts.length === 0 && type === "all" && mediaId === "all") {
    return (
      <Card className="border-dashed glass-card">
        <CardContent className="py-12">
          <div className="text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No concepts extracted yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Concepts will appear here once media processing completes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            aria-label="Filter concepts by type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500"
          >
            <option value="all">All Types</option>
            <option value="definition">Definition</option>
            <option value="framework">Framework</option>
            <option value="methodology">Methodology</option>
            <option value="principle">Principle</option>
            <option value="insight">Insight</option>
            <option value="fact">Fact</option>
            <option value="recommendation">Recommendation</option>
          </select>
          
          <select
            aria-label="Filter concepts by media"
            value={mediaId}
            onChange={(e) => {
              setMediaId(e.target.value);
              setPage(1);
            }}
            className="h-9 max-w-[200px] rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500"
          >
            <option value="all">All Media</option>
            {mediaItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title.substring(0, 30)}{item.title.length > 30 ? "..." : ""}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-muted-foreground">
          {total} concepts found
        </span>
      </div>

      <div className="grid gap-4">
        {concepts.map((concept) => (
          <Card key={concept.id} className="glass-card">
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">
                      {concept.name}
                    </h4>
                    <Badge variant="outline" className="text-xs uppercase">
                      {concept.concept_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {concept.description}
                  </p>
                  
                  {concept.media_title && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Video className="h-3 w-3 shrink-0" />
                      {concept.source_url ? (
                        <a
                          href={concept.start_time != null ? `${concept.source_url}&t=${Math.floor(concept.start_time)}` : concept.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-palkia-500 hover:underline"
                          title={concept.media_title}
                        >
                          {concept.media_title}
                          {concept.start_time != null && ` @ ${formatTimestamp(concept.start_time)}`}
                        </a>
                      ) : (
                        <span className="truncate" title={concept.media_title}>
                          {concept.media_title}
                          {concept.start_time != null && ` @ ${formatTimestamp(concept.start_time)}`}
                        </span>
                      )}
                    </div>
                  )}

                  {concept.context && (
                    <div className="mt-3 text-xs text-muted-foreground bg-muted p-2 rounded border-l-2 border-palkia-300">
                      "{concept.context}"
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function EntitiesTab({ kbId, mediaItems }: { kbId: string; mediaItems: MediaContent[] }) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const [mediaId, setMediaId] = useState<string>("all");
  const limit = 20;
  
  const { data, isLoading } = useEntities(kbId, page, limit, type, mediaId);
  const entities = data?.items || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (entities.length === 0 && type === "all" && mediaId === "all") {
    return (
      <Card className="border-dashed glass-card">
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No entities extracted yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Entities will appear here once media processing completes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            aria-label="Filter entities by type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500"
          >
            <option value="all">All Types</option>
            <option value="person">Person</option>
            <option value="book">Book</option>
            <option value="tool">Tool</option>
            <option value="company">Company</option>
            <option value="concept">Concept</option>
            <option value="resource">Resource</option>
            <option value="event">Event</option>
          </select>
          
          <select
            aria-label="Filter entities by media"
            value={mediaId}
            onChange={(e) => {
              setMediaId(e.target.value);
              setPage(1);
            }}
            className="h-9 max-w-[200px] rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500"
          >
            <option value="all">All Media</option>
            {mediaItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title.substring(0, 30)}{item.title.length > 30 ? "..." : ""}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-muted-foreground">
          {total} entities found
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <Card key={entity.id} className="glass-card">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground">
                      {entity.name}
                    </h4>
                    <Badge variant="outline" className="text-xs uppercase">
                      {entity.entity_type}
                    </Badge>
                  </div>
                  {entity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {entity.description}
                    </p>
                  )}
                  {entity.url && (
                    <a 
                      href={entity.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-palkia-500 hover:underline mt-1 inline-block"
                    >
                      Learn more
                    </a>
                  )}
                  
                  {entity.media_title && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Video className="h-3 w-3 shrink-0" />
                      {entity.source_url ? (
                        <a
                          href={entity.start_time != null ? `${entity.source_url}&t=${Math.floor(entity.start_time)}` : entity.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-palkia-500 hover:underline"
                          title={entity.media_title}
                        >
                          {entity.media_title}
                          {entity.start_time != null && ` @ ${formatTimestamp(entity.start_time)}`}
                        </a>
                      ) : (
                        <span className="truncate" title={entity.media_title}>
                          {entity.media_title}
                          {entity.start_time != null && ` @ ${formatTimestamp(entity.start_time)}`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
