import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { knowledgeBasesApi } from "@/lib/api";
import type { KnowledgeBaseCreate, SourceCreate } from "@/types/api";
import { toast } from "sonner";
import { isValidUUID } from "@/lib/utils";

export function useKnowledgeBases() {
  return useQuery({
    queryKey: ["knowledge-bases"],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getAll();
      return data;
    },
  });
}

export function useKnowledgeBase(id: string) {
  return useQuery({
    queryKey: ["knowledge-bases", id],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getById(id);
      return data;
    },
    enabled: !!id && isValidUUID(id),
  });
}

export function useCreateKnowledgeBase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: KnowledgeBaseCreate) => {
      const response = await knowledgeBasesApi.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases"] });
      toast.success("Knowledge base created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create knowledge base");
      console.error(error);
    },
  });
}

export function useDeleteKnowledgeBase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await knowledgeBasesApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases"] });
      toast.success("Knowledge base deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete knowledge base");
      console.error(error);
    },
  });
}

export function useSources(kbId: string) {
  return useQuery({
    queryKey: ["sources", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getSources(kbId);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
  });
}

export function useAddSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ kbId, data }: { kbId: string; data: SourceCreate }) => {
      const response = await knowledgeBasesApi.addSource(kbId, data);
      return response.data;
    },
    onSuccess: (_, { kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["sources", kbId] });
      queryClient.invalidateQueries({ queryKey: ["videos", kbId] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases", kbId] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases"] });
      toast.success("Source added successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to add source");
      console.error(error);
    },
  });
}

export function useDeleteSource() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sourceId, kbId }: { sourceId: string; kbId: string }) => {
      await knowledgeBasesApi.deleteSource(sourceId);
      return { kbId };
    },
    onSuccess: (_, { kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["sources", kbId] });
      queryClient.invalidateQueries({ queryKey: ["videos", kbId] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases", kbId] });
      queryClient.invalidateQueries({ queryKey: ["knowledge-bases"] });
      toast.success("Source deleted");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete source");
      console.error(error);
    },
  });
}

export function useSourceIngestionStatus(sourceId: string) {
  return useQuery({
    queryKey: ["source-ingestion", sourceId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getSourceIngestionStatus(sourceId);
      return data;
    },
    enabled: !!sourceId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "completed" || data?.status === "failed") return false;
      return 2000;
    },
  });
}

export function useVideos(kbId: string) {
  return useQuery({
    queryKey: ["videos", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getVideos(kbId);
      return data.items;
    },
    enabled: !!kbId && isValidUUID(kbId),
  });
}

export function useProcessingStatus(kbId: string) {
  return useQuery({
    queryKey: ["processing-status", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getProcessingStatus(kbId);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.processing > 0) return 3000;
      return false;
    },
  });
}

export function usePipelineStatus(kbId: string) {
  return useQuery({
    queryKey: ["pipeline-status", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getPipelineStatus(kbId);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === "processing") return 2000;
      if (data?.status === "completed") return false;
      return 5000;
    },
  });
}

export function useRunPipeline() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (kbId: string) => {
      const response = await knowledgeBasesApi.runPipeline(kbId);
      return response.data;
    },
    onSuccess: (_, kbId) => {
      queryClient.invalidateQueries({ queryKey: ["pipeline-status", kbId] });
      toast.success("Pipeline started");
    },
    onError: (error: Error) => {
      toast.error("Failed to start pipeline");
      console.error(error);
    },
  });
}

export function useExtractionStatus(kbId: string) {
  return useQuery({
    queryKey: ["extraction-status", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getExtractionStatus(kbId);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
  });
}

export function useConcepts(kbId: string, page = 1, limit = 20, type?: string, videoId?: string, includeOrigin = true) {
  return useQuery({
    queryKey: ["concepts", kbId, page, limit, type, videoId, includeOrigin],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getConcepts(kbId, page, limit, type, videoId, includeOrigin);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    placeholderData: (previousData) => previousData,
  });
}

export function useEntities(kbId: string, page = 1, limit = 20, type?: string, videoId?: string, includeOrigin = true) {
  return useQuery({
    queryKey: ["entities", kbId, page, limit, type, videoId, includeOrigin],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getEntities(kbId, page, limit, type, videoId, includeOrigin);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    placeholderData: (previousData) => previousData,
  });
}

export function useConsolidatedIdeas(kbId: string, limit = 50) {
  return useQuery({
    queryKey: ["consolidated-ideas", kbId, limit],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getConsolidatedIdeas(kbId, limit);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
  });
}

export function useTemporalPatterns(kbId: string) {
  return useQuery({
    queryKey: ["temporal-patterns", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getTemporalPatterns(kbId);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
  });
}
