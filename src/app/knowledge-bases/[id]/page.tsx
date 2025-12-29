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
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Filter
} from "lucide-react";
import { 
  Button, 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
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
} from "@/components/ui";
import { Navbar, Sidebar, PipelineProgress } from "@/components/shared";
import { 
  useKnowledgeBase, 
  useSources, 
  useVideos, 
  useConcepts, 
  useEntities,
  useAddSource,
  useRunPipeline,
  usePipelineStatus,
  useExtractionStatus,
  useDeleteKnowledgeBase,
  useDeleteSource,
  useSourceIngestionStatus,
} from "@/lib/hooks";
import { formatDate, formatDuration, formatTimestamp, detectYouTubeSourceType } from "@/lib/utils";
import type { Source, Video as VideoType, ExtractedConcept, ExtractedEntity, ProcessingStatus } from "@/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function KnowledgeBaseDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: kb, isLoading: kbLoading } = useKnowledgeBase(id);
  const { data: sources } = useSources(id);
  const { data: videos } = useVideos(id);
  const { data: extractionStatus } = useExtractionStatus(id);
  const { data: pipelineStatus } = usePipelineStatus(id);
  
  const runPipelineMutation = useRunPipeline();
  const addSourceMutation = useAddSource();
  const deleteMutation = useDeleteKnowledgeBase();
  const deleteSourceMutation = useDeleteSource();
  
  const [activeTab, setActiveTab] = useState("sources");
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");

  const detectedSourceType = sourceUrl ? detectYouTubeSourceType(sourceUrl) : null;
  const hasCompletedVideos = videos?.some(v => v.status === "completed");
  const isIngesting = videos?.some(v => ["pending", "downloading", "transcribing", "processing"].includes(v.status));
  
  const handleAddSource = async () => {
    if (!sourceUrl.trim()) return;
    
    await addSourceMutation.mutateAsync({
      kbId: id,
      data: { url: sourceUrl.trim() },
    });
    
    setSourceUrl("");
    setIsAddSourceOpen(false);
  };

  const handleRunPipeline = async () => {
    if (isIngesting) {
      setIsWarningOpen(true);
      return;
    }
    await runPipelineMutation.mutateAsync(id);
  };

  const confirmRunPipeline = async () => {
    setIsWarningOpen(false);
    await runPipelineMutation.mutateAsync(id);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/knowledge-bases");
  };

  const handleDeleteSource = async (sourceId: string) => {
    await deleteSourceMutation.mutateAsync({ sourceId, kbId: id });
  };

  const isPipelineRunning = pipelineStatus?.status === "processing";

  if (kbLoading) {
    return (
      <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
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
      <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
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
    <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <Link 
              href="/knowledge-bases"
              className="inline-flex items-center gap-1 text-sm text-silver-500 hover:text-palkia-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Knowledge Bases
            </Link>
          </div>

          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-silver-900 dark:text-silver-100">
                {kb.name}
              </h1>
              <p className="mt-1 text-silver-500 dark:text-silver-400">
                {kb.description || "No description"}
              </p>
              <div className="mt-3 flex items-center gap-4 text-sm text-silver-500">
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
                variant="outline" 
                onClick={() => setIsAddSourceOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Source
              </Button>
              <Button 
                variant="gradient"
                onClick={handleRunPipeline}
                disabled={isPipelineRunning || !hasCompletedVideos}
                className="gap-2"
                title={!hasCompletedVideos ? "At least one video must be completed" : ""}
              >
                {isPipelineRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isPipelineRunning ? "Processing..." : "Run Pipeline"}
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

          {isPipelineRunning && pipelineStatus && (
            <Card className="mb-6 border-palkia-200 dark:border-palkia-800">
              <CardContent className="py-4">
                <PipelineProgress status={pipelineStatus} />
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <StatCard 
              title="Sources" 
              value={sources?.length || 0} 
              icon={Database}
              color="palkia"
            />
            <StatCard 
              title="Videos" 
              value={videos?.length || 0} 
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
            <TabsList className="mb-4">
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <SourcesTab 
                sources={sources || []} 
                videos={videos || []}
                kbId={id}
                onAddSource={() => setIsAddSourceOpen(true)} 
                onDeleteSource={handleDeleteSource}
                isDeletingSource={deleteSourceMutation.isPending}
              />
            </TabsContent>
            
            <TabsContent value="concepts">
              <ConceptsTab kbId={id} videos={videos || []} />
            </TabsContent>
            
            <TabsContent value="entities">
              <EntitiesTab kbId={id} videos={videos || []} />
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
              variant="gradient"
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
              All sources, videos, and extracted intelligence will be permanently removed.
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

      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processing in Progress</DialogTitle>
            <DialogDescription>
              Some videos are still being processed (downloading or transcribing). 
              The pipeline will only use videos that have been fully completed.
              
              Do you want to proceed with the available completed videos?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWarningOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={confirmRunPipeline}>
              Proceed Anyway
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
    <Card className="card-palkia">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-silver-500">{title}</p>
            <p className="text-2xl font-bold text-silver-900 dark:text-silver-100">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color === "palkia" ? "text-palkia-500" : "text-pearl-500"}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function SourcesTab({ 
  sources, 
  videos,
  kbId,
  onAddSource,
  onDeleteSource,
  isDeletingSource
}: { 
  sources: Source[]; 
  videos: VideoType[];
  kbId: string;
  onAddSource: () => void;
  onDeleteSource: (sourceId: string) => void;
  isDeletingSource: boolean;
}) {
  const videosBySourceId = useMemo(() => {
    const map: Record<string, VideoType[]> = {};
    for (const v of videos) {
      (map[v.source_id] ??= []).push(v);
    }
    return map;
  }, [videos]);

  if (sources.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Youtube className="mx-auto h-12 w-12 text-silver-300" />
            <h3 className="mt-4 text-lg font-medium text-silver-900 dark:text-silver-100">
              No sources yet
            </h3>
            <p className="mt-1 text-sm text-silver-500">
              Add YouTube channels, playlists, or videos as sources
            </p>
            <Button variant="gradient" className="mt-4" onClick={onAddSource}>
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
          videos={videosBySourceId[source.id] ?? []}
          onDelete={() => onDeleteSource(source.id)}
          isDeleting={isDeletingSource}
        />
      ))}
    </div>
  );
}

function SourceCard({ 
  source, 
  videos, 
  onDelete,
  isDeleting
}: { 
  source: Source; 
  videos: VideoType[]; 
  onDelete: () => void;
  isDeleting: boolean;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: ingestionStatus } = useSourceIngestionStatus(source.id);
  
  const isMetadataLoading = !source.title;

  const stats = useMemo(() => {
    return {
      total: videos.length,
      pending: videos.filter(v => v.status === "pending").length,
      downloading: videos.filter(v => v.status === "downloading").length,
      transcribing: videos.filter(v => v.status === "transcribing").length,
      processing: videos.filter(v => ["processing", "extracting"].includes(v.status)).length,
      completed: videos.filter(v => v.status === "completed").length,
      failed: videos.filter(v => v.status === "failed").length,
    };
  }, [videos]);

  const activeProcessingCount = stats.downloading + stats.transcribing + stats.processing;
  const progressPercent = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
  };

  const getIngestionMessage = () => {
    if (isMetadataLoading) return "Extrayendo metadatos...";
    if (!ingestionStatus) return null;
    return ingestionStatus.message;
  };

  const ingestionMessage = getIngestionMessage();
  const showIngestionStatus = isMetadataLoading || (ingestionStatus && ingestionStatus.status === "processing");
  
  return (
    <>
      <Card className="card-palkia flex flex-col h-full transition-all duration-300">
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
                  <h4 className="font-medium text-silver-900 dark:text-silver-100 truncate" title={source.title || "Untitled Source"}>
                    {source.title || "Untitled Source"}
                  </h4>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-silver-500 truncate block hover:text-palkia-500"
                  >
                    {source.url}
                  </a>
                </>
              )}
              <div className="mt-2 text-xs text-silver-400">
                Added {formatDate(source.created_at)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-silver-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0"
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
              <span className="text-silver-500">Progress</span>
              <span className="font-medium text-silver-900 dark:text-silver-100">
                {stats.completed} / {stats.total} Videos
              </span>
            </div>
            
            <Progress value={progressPercent} className="h-2" />
            
            <div className="flex flex-wrap gap-2 text-xs">
              {stats.pending > 0 && (
                <Badge variant="outline" className="text-silver-500 border-silver-200">
                  {stats.pending} Pending
                </Badge>
              )}
              {activeProcessingCount > 0 && (
                <Badge variant="pearl" className="animate-pulse">
                  {activeProcessingCount} Processing
                </Badge>
              )}
              {stats.failed > 0 && (
                <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100 hover:text-red-700">
                  {stats.failed} Failed
                </Badge>
              )}
              {stats.completed === stats.total && stats.total > 0 && (
                <Badge variant="palkia">All Completed</Badge>
              )}
            </div>

            {videos.length > 0 && (
              <div className="pt-2">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between text-silver-500 hover:text-silver-900 dark:hover:text-silver-100 hover:bg-silver-100 dark:hover:bg-silver-800/50"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {isExpanded ? "Hide Videos" : "Show Videos"}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-silver-100 dark:border-silver-800 pt-3 animate-in slide-in-from-top-2 duration-200">
                    {videos.map((video) => (
                      <div 
                        key={video.id} 
                        className="group flex gap-3 p-2 rounded-lg hover:bg-silver-50 dark:hover:bg-silver-900/50 transition-colors"
                      >
                        {video.thumbnail_url ? (
                          <div className="relative shrink-0">
                            <img 
                              src={video.thumbnail_url} 
                              alt={video.title}
                              className="h-12 w-20 rounded object-cover border border-silver-200 dark:border-silver-700"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity rounded">
                              <Play className="h-4 w-4 text-white fill-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="h-12 w-20 shrink-0 rounded bg-silver-100 dark:bg-silver-800 flex items-center justify-center border border-silver-200 dark:border-silver-700">
                            <Video className="h-4 w-4 text-silver-400" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <h5 className="text-sm font-medium text-silver-900 dark:text-silver-100 truncate" title={video.title}>
                            {video.title}
                          </h5>
                          
                          <div className="flex items-center gap-2 text-xs text-silver-500">
                            {video.duration_seconds && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" />
                                {formatDuration(video.duration_seconds)}
                              </span>
                            )}
                            <StatusBadge status={video.status} />
                          </div>
                        </div>

                        <a 
                          href={`https://youtube.com/watch?v=${video.youtube_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 self-start text-silver-400 hover:text-palkia-500 p-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Source</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{source.title || "this source"}"? 
              This will also delete all {stats.total} associated videos and their data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function VideosTab({ videos }: { videos: VideoType[] }) {
  const safeVideos = Array.isArray(videos) ? videos : [];

  if (safeVideos.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Video className="mx-auto h-12 w-12 text-silver-300" />
            <h3 className="mt-4 text-lg font-medium text-silver-900 dark:text-silver-100">
              No videos yet
            </h3>
            <p className="mt-1 text-sm text-silver-500">
              Videos will appear here after adding sources
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {safeVideos.map((video) => (
        <Card key={video.id} className="card-palkia">
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              {video.thumbnail_url ? (
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="h-16 w-28 rounded object-cover"
                />
              ) : (
                <div className="h-16 w-28 rounded bg-silver-200 dark:bg-silver-700 flex items-center justify-center">
                  <Video className="h-6 w-6 text-silver-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-silver-900 dark:text-silver-100 truncate">
                  {video.title}
                </h4>
                <div className="mt-1 flex items-center gap-3 text-xs text-silver-500">
                  {video.duration_seconds && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(video.duration_seconds)}
                    </span>
                  )}
                  {video.upload_date && (
                    <span>{formatDate(video.upload_date)}</span>
                  )}
                </div>
              </div>
              <StatusBadge status={video.status} />
              <a 
                href={`https://youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-400 hover:text-palkia-500"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ProcessingStatus }) {
  const config: Record<ProcessingStatus, { label: string; variant: "default" | "palkia" | "pearl" | "outline"; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { label: "Pending", variant: "outline", icon: Clock },
    downloading: { label: "Downloading", variant: "outline", icon: RefreshCw },
    transcribing: { label: "Transcribing", variant: "pearl", icon: RefreshCw },
    processing: { label: "Processing", variant: "pearl", icon: RefreshCw },
    extracting: { label: "Extracting", variant: "palkia", icon: RefreshCw },
    completed: { label: "Completed", variant: "palkia", icon: CheckCircle2 },
    failed: { label: "Failed", variant: "default", icon: XCircle },
  };

  const { label, variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className={`h-3 w-3 ${status === "failed" ? "text-red-500" : ""} ${["downloading", "transcribing", "processing", "extracting"].includes(status) ? "animate-spin" : ""}`} />
      {label}
    </Badge>
  );
}

function ConceptsTab({ kbId, videos }: { kbId: string; videos: VideoType[] }) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const [videoId, setVideoId] = useState<string>("all");
  const limit = 20;
  
  const { data, isLoading } = useConcepts(kbId, page, limit, type, videoId);
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

  if (concepts.length === 0 && type === "all" && videoId === "all") {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Lightbulb className="mx-auto h-12 w-12 text-silver-300" />
            <h3 className="mt-4 text-lg font-medium text-silver-900 dark:text-silver-100">
              No concepts extracted yet
            </h3>
            <p className="mt-1 text-sm text-silver-500">
              Run the pipeline to extract concepts from your videos
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
          <Filter className="h-4 w-4 text-silver-500" />
          <select
            aria-label="Filter concepts by type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-silver-300 bg-white px-3 text-sm text-silver-900 focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500 dark:border-silver-700 dark:bg-silver-900 dark:text-silver-100"
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
            aria-label="Filter concepts by video"
            value={videoId}
            onChange={(e) => {
              setVideoId(e.target.value);
              setPage(1);
            }}
            className="h-9 max-w-[200px] rounded-lg border border-silver-300 bg-white px-3 text-sm text-silver-900 focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500 dark:border-silver-700 dark:bg-silver-900 dark:text-silver-100"
          >
            <option value="all">All Videos</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.title.substring(0, 30)}{video.title.length > 30 ? "..." : ""}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-silver-500">
          {total} concepts found
        </span>
      </div>

      <div className="grid gap-4">
        {concepts.map((concept) => (
          <Card key={concept.id} className="card-palkia">
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-silver-900 dark:text-silver-100">
                      {concept.name}
                    </h4>
                    <Badge variant="outline" className="text-xs uppercase">
                      {concept.concept_type}
                    </Badge>
                  </div>
                  <p className="text-sm text-silver-600 dark:text-silver-300">
                    {concept.description}
                  </p>
                  
                  {concept.video_title && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-silver-500">
                      <Video className="h-3 w-3 shrink-0" />
                      {concept.source_url ? (
                        <a
                          href={concept.start_time != null ? `${concept.source_url}&t=${Math.floor(concept.start_time)}` : concept.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-palkia-500 hover:underline"
                          title={concept.video_title}
                        >
                          {concept.video_title}
                          {concept.start_time != null && ` @ ${formatTimestamp(concept.start_time)}`}
                        </a>
                      ) : (
                        <span className="truncate" title={concept.video_title}>
                          {concept.video_title}
                          {concept.start_time != null && ` @ ${formatTimestamp(concept.start_time)}`}
                        </span>
                      )}
                    </div>
                  )}

                  {concept.context && (
                    <div className="mt-3 text-xs text-silver-500 bg-silver-50 dark:bg-silver-900/50 p-2 rounded border-l-2 border-palkia-300">
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
          <span className="text-sm text-silver-500">
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



function EntitiesTab({ kbId, videos }: { kbId: string; videos: VideoType[] }) {
  const [page, setPage] = useState(1);
  const [type, setType] = useState<string>("all");
  const [videoId, setVideoId] = useState<string>("all");
  const limit = 20;
  
  const { data, isLoading } = useEntities(kbId, page, limit, type, videoId);
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

  if (entities.length === 0 && type === "all" && videoId === "all") {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="mx-auto h-12 w-12 text-silver-300" />
            <h3 className="mt-4 text-lg font-medium text-silver-900 dark:text-silver-100">
              No entities extracted yet
            </h3>
            <p className="mt-1 text-sm text-silver-500">
              Run the pipeline to extract entities from your videos
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
          <Filter className="h-4 w-4 text-silver-500" />
          <select
            aria-label="Filter entities by type"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-silver-300 bg-white px-3 text-sm text-silver-900 focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500 dark:border-silver-700 dark:bg-silver-900 dark:text-silver-100"
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
            aria-label="Filter entities by video"
            value={videoId}
            onChange={(e) => {
              setVideoId(e.target.value);
              setPage(1);
            }}
            className="h-9 max-w-[200px] rounded-lg border border-silver-300 bg-white px-3 text-sm text-silver-900 focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500 dark:border-silver-700 dark:bg-silver-900 dark:text-silver-100"
          >
            <option value="all">All Videos</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.title.substring(0, 30)}{video.title.length > 30 ? "..." : ""}
              </option>
            ))}
          </select>
        </div>
        <span className="text-sm text-silver-500">
          {total} entities found
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <Card key={entity.id} className="card-palkia">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-pearl-100 dark:bg-pearl-900/30 p-2">
                  <Users className="h-4 w-4 text-pearl-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-silver-900 dark:text-silver-100">
                      {entity.name}
                    </h4>
                    <Badge variant="outline" className="text-xs uppercase">
                      {entity.entity_type}
                    </Badge>
                  </div>
                  {entity.description && (
                    <p className="text-sm text-silver-500 line-clamp-2 mt-1">
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
                  
                  {entity.video_title && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-silver-500">
                      <Video className="h-3 w-3 shrink-0" />
                      {entity.source_url ? (
                        <a
                          href={entity.start_time != null ? `${entity.source_url}&t=${Math.floor(entity.start_time)}` : entity.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate hover:text-palkia-500 hover:underline"
                          title={entity.video_title}
                        >
                          {entity.video_title}
                          {entity.start_time != null && ` @ ${formatTimestamp(entity.start_time)}`}
                        </a>
                      ) : (
                        <span className="truncate" title={entity.video_title}>
                          {entity.video_title}
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
          <span className="text-sm text-silver-500">
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
