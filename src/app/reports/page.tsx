"use client";

import Link from "next/link";
import { FileText, Loader2, ExternalLink, Calendar, Database } from "lucide-react";
import { 
  Button, 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from "@/components/ui";
import { Navbar, Sidebar } from "@/components/shared";
import { useReports, type ReportWithKBName } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const { data: reports, isLoading, error } = useReports();

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-silver-900 dark:text-silver-100">
              Intelligence Reports
            </h1>
            <p className="mt-1 text-silver-500 dark:text-silver-400">
              Generated reports from your knowledge bases
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="card-palkia">
                  <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="py-6">
                <p className="text-center text-red-700 dark:text-red-400">
                  Failed to load reports. Is the backend running?
                </p>
              </CardContent>
            </Card>
          ) : reports && reports.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report: ReportWithKBName) => (
                <Link key={report.id} href={`/reports/${report.id}`}>
                  <Card className="card-palkia h-full cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base line-clamp-2">
                          {report.title}
                        </CardTitle>
                        {report.is_latest && (
                          <Badge variant="palkia" className="shrink-0">Latest</Badge>
                        )}
                      </div>
                      <p className="text-xs text-silver-500 dark:text-silver-400 mt-1">
                        {report.kb_name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-silver-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(report.created_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          v{report.version}
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
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-palkia-100 dark:bg-palkia-900/30">
                    <FileText className="h-6 w-6 text-palkia-600 dark:text-palkia-400" />
                  </div>
                  <h3 className="text-lg font-medium text-silver-900 dark:text-silver-100">
                    No reports yet
                  </h3>
                  <p className="mt-1 text-sm text-silver-500">
                    Reports will be generated when you run the pipeline on a knowledge base
                  </p>
                  <Link href="/knowledge-bases" className="mt-4 inline-block">
                    <Button variant="gradient">
                      <Database className="mr-2 h-4 w-4" />
                      Go to Knowledge Bases
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
