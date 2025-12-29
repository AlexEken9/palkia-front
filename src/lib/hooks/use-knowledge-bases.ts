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

export function useVideos(kbId: string) {
  return useQuery({
    queryKey: ["videos", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getVideos(kbId);
      return data;
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

export function useProcessVideos(kbId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await knowledgeBasesApi.processVideos(kbId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processing-status", kbId] });
      queryClient.invalidateQueries({ queryKey: ["videos", kbId] });
      toast.success("Video processing started");
    },
    onError: (error: Error) => {
      toast.error("Failed to start video processing");
      console.error(error);
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

export function useConcepts(kbId: string, limit = 100) {
  return useQuery({
    queryKey: ["concepts", kbId, limit],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getConcepts(kbId, limit);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
  });
}

export function useEntities(kbId: string, limit = 100) {
  return useQuery({
    queryKey: ["entities", kbId, limit],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getEntities(kbId, limit);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
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
