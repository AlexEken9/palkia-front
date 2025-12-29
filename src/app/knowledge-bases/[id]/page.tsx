"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Video, 
  Database,
  Lightbulb,
  Users,
  FileText,
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
import { Navbar, Sidebar } from "@/components/shared";
import { 
  useKnowledgeBase, 
  useSources, 
  useVideos, 
  useConcepts, 
  useEntities,
  useAddSource,
  useRunPipeline,
  usePipelineStatus,
  useDeleteKnowledgeBase,
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
  const { data: concepts } = useConcepts(id);
  const { data: entities } = useEntities(id);
  const { data: pipelineStatus } = usePipelineStatus(id);
  
  const runPipelineMutation = useRunPipeline();
  const addSourceMutation = useAddSource();
  const deleteMutation = useDeleteKnowledgeBase();
  
  const [activeTab, setActiveTab] = useState("sources");
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");

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

  const handleRunPipeline = async () => {
    await runPipelineMutation.mutateAsync(id);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push("/knowledge-bases");
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
                  <Video className="h-4 w-4" />
                  {videos?.length || 0} videos
                </span>
                <span className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  {concepts?.length || 0} concepts
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
                disabled={isPipelineRunning || !videos?.length}
                className="gap-2"
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-silver-700 dark:text-silver-300">
                    Pipeline Progress: {pipelineStatus.current_stage}
                  </span>
                  <span className="text-sm text-silver-500">
                    {pipelineStatus.progress_percent}%
                  </span>
                </div>
                <Progress 
                  value={pipelineStatus.progress_percent} 
                  className="h-2"
                  indicatorClassName="bg-gradient-to-r from-palkia-500 to-pearl-500"
                />
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
              value={concepts?.length || 0} 
              icon={Lightbulb}
              color="palkia"
            />
            <StatCard 
              title="Entities" 
              value={entities?.length || 0} 
              icon={Users}
              color="pearl"
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="concepts">Concepts</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <SourcesTab sources={sources || []} onAddSource={() => setIsAddSourceOpen(true)} />
            </TabsContent>
            
            <TabsContent value="videos">
              <VideosTab videos={videos || []} />
            </TabsContent>
            
            <TabsContent value="concepts">
              <ConceptsTab concepts={concepts || []} videos={videos || []} />
            </TabsContent>
            
            <TabsContent value="entities">
              <EntitiesTab entities={entities || []} videos={videos || []} />
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

function SourcesTab({ sources, onAddSource }: { sources: Source[]; onAddSource: () => void }) {
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
        <Card key={source.id} className="card-palkia">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-palkia-100 dark:bg-palkia-900/30 p-2">
                {source.source_type === "youtube_channel" && <User className="h-5 w-5 text-palkia-500" />}
                {source.source_type === "youtube_playlist" && <ListVideo className="h-5 w-5 text-palkia-500" />}
                {source.source_type === "youtube_video" && <Youtube className="h-5 w-5 text-palkia-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-silver-900 dark:text-silver-100 truncate">
                  {source.title || "Untitled Source"}
                </h4>
                <p className="text-sm text-silver-500 truncate">{source.url}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-silver-400">
                  <span className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    {source.video_count} videos
                  </span>
                  <span>{formatDate(source.created_at)}</span>
                </div>
              </div>
              <a 
                href={source.url} 
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

function VideosTab({ videos }: { videos: VideoType[] }) {
  if (videos.length === 0) {
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
      {videos.map((video) => (
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

function ConceptsTab({ concepts, videos }: { concepts: ExtractedConcept[]; videos: VideoType[] }) {
  const [selectedVideoId, setSelectedVideoId] = useState<string>("all");

  const filteredConcepts = useMemo(() => {
    if (selectedVideoId === "all") return concepts;
    return concepts.filter((c) => c.video_id === selectedVideoId);
  }, [concepts, selectedVideoId]);

  if (concepts.length === 0) {
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
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-silver-500" />
        <select
          value={selectedVideoId}
          onChange={(e) => setSelectedVideoId(e.target.value)}
          className="h-9 rounded-lg border border-silver-300 bg-white px-3 text-sm text-silver-900 focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500 dark:border-silver-700 dark:bg-silver-900 dark:text-silver-100"
        >
          <option value="all">All videos ({concepts.length})</option>
          {videos.map((video) => {
            const count = concepts.filter((c) => c.video_id === video.id).length;
            if (count === 0) return null;
            return (
              <option key={video.id} value={video.id}>
                {video.title} ({count})
              </option>
            );
          })}
        </select>
        {selectedVideoId !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedVideoId("all")}
            className="text-xs"
          >
            Clear filter
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredConcepts.map((concept) => (
          <Card key={concept.id} className="card-palkia">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{concept.name}</CardTitle>
                <Badge variant="outline" className="text-xs">{concept.concept_type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-silver-600 dark:text-silver-400 line-clamp-3">
                {concept.description}
              </p>
              {concept.raw_quote && (
                <blockquote className="mt-3 border-l-2 border-palkia-300 pl-3 text-xs italic text-silver-500">
                  "{concept.raw_quote}"
                </blockquote>
              )}
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
              <div className="mt-3 flex items-center justify-between text-xs text-silver-400">
                <span>Confidence: {Math.round(concept.confidence * 100)}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConcepts.length === 0 && selectedVideoId !== "all" && (
        <Card className="border-dashed">
          <CardContent className="py-8">
            <p className="text-center text-sm text-silver-500">
              No concepts found for this video
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EntitiesTab({ entities, videos }: { entities: ExtractedEntity[]; videos: VideoType[] }) {
  const [selectedVideoId, setSelectedVideoId] = useState<string>("all");

  const filteredEntities = useMemo(() => {
    if (selectedVideoId === "all") return entities;
    return entities.filter((e) => e.video_id === selectedVideoId);
  }, [entities, selectedVideoId]);

  if (entities.length === 0) {
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

  const groupedByType = filteredEntities.reduce((acc, entity) => {
    if (!acc[entity.entity_type]) acc[entity.entity_type] = [];
    acc[entity.entity_type].push(entity);
    return acc;
  }, {} as Record<string, ExtractedEntity[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-silver-500" />
        <select
          value={selectedVideoId}
          onChange={(e) => setSelectedVideoId(e.target.value)}
          className="h-9 rounded-lg border border-silver-300 bg-white px-3 text-sm text-silver-900 focus:border-palkia-500 focus:outline-none focus:ring-1 focus:ring-palkia-500 dark:border-silver-700 dark:bg-silver-900 dark:text-silver-100"
        >
          <option value="all">All videos ({entities.length})</option>
          {videos.map((video) => {
            const count = entities.filter((e) => e.video_id === video.id).length;
            if (count === 0) return null;
            return (
              <option key={video.id} value={video.id}>
                {video.title} ({count})
              </option>
            );
          })}
        </select>
        {selectedVideoId !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedVideoId("all")}
            className="text-xs"
          >
            Clear filter
          </Button>
        )}
      </div>

      {Object.keys(groupedByType).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedByType).map(([type, typeEntities]) => (
            <div key={type}>
              <h3 className="text-sm font-medium text-silver-500 uppercase tracking-wide mb-3">
                {type.replace("_", " ")} ({typeEntities.length})
              </h3>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {typeEntities.map((entity) => (
                  <Card key={entity.id} className="card-palkia">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-pearl-100 dark:bg-pearl-900/30 p-2">
                          <Users className="h-4 w-4 text-pearl-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-silver-900 dark:text-silver-100">
                            {entity.name}
                          </h4>
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
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-8">
            <p className="text-center text-sm text-silver-500">
              No entities found for this video
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
