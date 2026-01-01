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
    refetchInterval: 5000,
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
    refetchInterval: 5000,
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
      queryClient.invalidateQueries({ queryKey: ["media", kbId] });
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
      queryClient.invalidateQueries({ queryKey: ["media", kbId] });
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

export function useSourceIngestionStatus(sourceId: string, kbId?: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["source-ingestion", sourceId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getSourceIngestionStatus(sourceId);
      return data;
    },
    enabled: !!sourceId,
    refetchInterval: (query) => {
      const data = query.state.data;
      
      if (data?.status === "completed" || data?.status === "failed") {
        if (kbId) {
          queryClient.invalidateQueries({ queryKey: ["sources", kbId] });
          queryClient.invalidateQueries({ queryKey: ["media", kbId] });
          queryClient.invalidateQueries({ queryKey: ["extraction-status", kbId] });
          queryClient.invalidateQueries({ queryKey: ["concepts"] });
          queryClient.invalidateQueries({ queryKey: ["entities"] });
          queryClient.invalidateQueries({ queryKey: ["knowledge-bases", kbId] });
        }
        return false;
      }
      return 1500;
    },
  });
}

export function useMedia(kbId: string) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["media", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getMedia(kbId);
      return data.items;
    },
    enabled: !!kbId && isValidUUID(kbId),
    refetchInterval: (query) => {
      const items = query.state.data;
      if (!items || items.length === 0) return 5000;
      
      const hasActive = items.some((item: { status: string }) => 
        ["pending", "downloading", "transcribing", "processing", "extracting"].includes(item.status)
      );
      
      if (!hasActive) {
        queryClient.invalidateQueries({ queryKey: ["concepts"] });
        queryClient.invalidateQueries({ queryKey: ["entities"] });
        queryClient.invalidateQueries({ queryKey: ["knowledge-bases", kbId] });
      }
      
      return hasActive ? 2000 : 5000;
    },
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

export function useExtractionStatus(kbId: string) {
  return useQuery({
    queryKey: ["extraction-status", kbId],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getExtractionStatus(kbId);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    refetchInterval: 5000,
  });
}

export function useConcepts(kbId: string, page = 1, limit = 20, type?: string, mediaId?: string, includeOrigin = true) {
  return useQuery({
    queryKey: ["concepts", kbId, page, limit, type, mediaId, includeOrigin],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getConcepts(kbId, page, limit, type, mediaId, includeOrigin);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
  });
}

export function useEntities(kbId: string, page = 1, limit = 20, type?: string, mediaId?: string, includeOrigin = true) {
  return useQuery({
    queryKey: ["entities", kbId, page, limit, type, mediaId, includeOrigin],
    queryFn: async () => {
      const { data } = await knowledgeBasesApi.getEntities(kbId, page, limit, type, mediaId, includeOrigin);
      return data;
    },
    enabled: !!kbId && isValidUUID(kbId),
    placeholderData: (previousData) => previousData,
    refetchInterval: 5000,
  });
}

export function useRetryMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ kbId, mediaId }: { kbId: string; mediaId: string }) => {
      const response = await knowledgeBasesApi.retryMedia(kbId, mediaId);
      return response.data;
    },
    onSuccess: (_, { kbId }) => {
      queryClient.invalidateQueries({ queryKey: ["media", kbId] });
      queryClient.invalidateQueries({ queryKey: ["source-ingestion"] });
      queryClient.invalidateQueries({ queryKey: ["processing-status", kbId] });
      toast.success("Retry started");
    },
    onError: (error: Error) => {
      toast.error("Retry failed");
      console.error(error);
    },
  });
}
