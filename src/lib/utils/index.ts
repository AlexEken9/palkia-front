import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUUID(uuid: string): boolean {
  return UUID_REGEX.test(uuid);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function detectYouTubeSourceType(url: string): "channel" | "playlist" | "video" | "unknown" {
  if (url.includes("/@") || url.includes("/channel/") || url.includes("/c/")) {
    return "channel";
  }
  if (url.includes("playlist") || url.includes("list=")) {
    return "playlist";
  }
  if (url.includes("watch?v=") || url.includes("youtu.be/")) {
    return "video";
  }
  return "unknown";
}

export function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
