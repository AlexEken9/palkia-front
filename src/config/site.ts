export const siteConfig = {
  name: "Palkia",
  description: "Intelligence Extraction System - Generate knowledge from YouTube content",
  version: "0.1.0",
  links: {
    github: "https://github.com/AlexEken9/palkia",
    docs: "/docs",
  },
} as const;

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  version: "v1",
  endpoints: {
    knowledgeBases: "/api/v1/knowledge-bases",
    reports: "/api/v1/reports",
  },
} as const;
