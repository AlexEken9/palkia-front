import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProcessingStatus } from "@/types/api";

interface MediaPollingItem {
  kbId: string;
  mediaId: string;
  status: ProcessingStatus;
  lastUpdated: number;
}

interface MediaPollingState {
  activePolling: Record<string, MediaPollingItem>;
  
  startPolling: (kbId: string, mediaId: string, status: ProcessingStatus) => void;
  stopPolling: (mediaId: string) => void;
  updateStatus: (mediaId: string, status: ProcessingStatus) => void;
  isPolling: (mediaId: string) => boolean;
  getPollingItem: (mediaId: string) => MediaPollingItem | undefined;
  cleanupStale: (maxAgeMs?: number) => void;
}

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

export const useMediaPollingStore = create<MediaPollingState>()(
  persist(
    (set, get) => ({
      activePolling: {},

      startPolling: (kbId, mediaId, status) => {
        set((state) => ({
          activePolling: {
            ...state.activePolling,
            [mediaId]: {
              kbId,
              mediaId,
              status,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      stopPolling: (mediaId) => {
        set((state) => {
          const { [mediaId]: _, ...rest } = state.activePolling;
          return { activePolling: rest };
        });
      },

      updateStatus: (mediaId, status) => {
        set((state) => {
          const existing = state.activePolling[mediaId];
          if (!existing) return state;
          
          return {
            activePolling: {
              ...state.activePolling,
              [mediaId]: {
                ...existing,
                status,
                lastUpdated: Date.now(),
              },
            },
          };
        });
      },

      isPolling: (mediaId) => {
        return mediaId in get().activePolling;
      },

      getPollingItem: (mediaId) => {
        return get().activePolling[mediaId];
      },

      cleanupStale: (maxAgeMs = THIRTY_MINUTES_MS) => {
        const now = Date.now();
        set((state) => {
          const cleaned: Record<string, MediaPollingItem> = {};
          for (const [id, item] of Object.entries(state.activePolling)) {
            if (now - item.lastUpdated < maxAgeMs) {
              cleaned[id] = item;
            }
          }
          return { activePolling: cleaned };
        });
      },
    }),
    {
      name: "palkia-media-polling",
    }
  )
);
