"use client";

import Link from "next/link";
import { Plus, Database, Video, FileText, ArrowRight, Loader2 } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Navbar, Sidebar, PalkiaSvg } from "@/components/shared";
import { useKnowledgeBases } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: knowledgeBases, isLoading, error } = useKnowledgeBases();

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-silver-900 dark:text-silver-100">
                Dashboard
              </h1>
              <p className="mt-1 text-silver-500 dark:text-silver-400">
                Welcome to Palkia Intelligence Extraction System
              </p>
            </div>
            <Link href="/knowledge-bases/new">
              <Button variant="gradient" className="gap-2">
                <Plus className="h-4 w-4" />
                New Knowledge Base
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-palkia">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-silver-500">
                  Knowledge Bases
                </CardTitle>
                <Database className="h-5 w-5 text-palkia-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-silver-900 dark:text-silver-100">
                  {isLoading ? "-" : knowledgeBases?.length || 0}
                </div>
                <p className="text-xs text-silver-500">Total created</p>
              </CardContent>
            </Card>

            <Card className="card-palkia">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-silver-500">
                  Videos Processed
                </CardTitle>
                <Video className="h-5 w-5 text-pearl-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-silver-900 dark:text-silver-100">
                  {isLoading ? "-" : knowledgeBases?.reduce((acc, kb) => acc + kb.video_count, 0) || 0}
                </div>
                <p className="text-xs text-silver-500">Across all bases</p>
              </CardContent>
            </Card>

            <Card className="card-palkia">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-silver-500">
                  Total Sources
                </CardTitle>
                <FileText className="h-5 w-5 text-palkia-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-silver-900 dark:text-silver-100">
                  {isLoading ? "-" : knowledgeBases?.reduce((acc, kb) => acc + kb.source_count, 0) || 0}
                </div>
                <p className="text-xs text-silver-500">YouTube channels, playlists</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-silver-900 dark:text-silver-100">
                Your Knowledge Bases
              </h2>
              <Link href="/knowledge-bases">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
            ) : knowledgeBases && knowledgeBases.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {knowledgeBases.slice(0, 6).map((kb) => (
                  <Link key={kb.id} href={`/knowledge-bases/${kb.id}`}>
                    <Card className="card-palkia h-full cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="mb-4">
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
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-6">
                      <PalkiaSvg size={120} className="mx-auto opacity-80" />
                    </div>
                    <h3 className="text-lg font-medium text-silver-900 dark:text-silver-100">
                      No knowledge bases yet
                    </h3>
                    <p className="mt-1 text-sm text-silver-500">
                      Create your first knowledge base to start extracting intelligence from YouTube
                    </p>
                    <Link href="/knowledge-bases" className="mt-4 inline-block">
                      <Button variant="gradient">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Knowledge Base
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
