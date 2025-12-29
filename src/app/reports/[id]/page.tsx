"use client";

import { use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  FileText,
  Loader2,
  Database,
} from "lucide-react";
import { 
  Button, 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import { Navbar, Sidebar } from "@/components/shared";
import { useReport, useReportMarkdown } from "@/lib/hooks";
import { reportsApi } from "@/lib/api";
import { formatDate, isValidUUID } from "@/lib/utils";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { id } = use(params);
  const isValid = isValidUUID(id);
  
  const { data: report, isLoading: reportLoading, error: reportError } = useReport(isValid ? id : "");
  const { data: markdown, isLoading: markdownLoading } = useReportMarkdown(isValid ? id : "");

  const handleDownload = async () => {
    if (!report) return;
    
    try {
      const response = await reportsApi.downloadMarkdown(id);
      const blob = new Blob([response.data], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.title.replace(/[^a-z0-9]/gi, "_")}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  if (!isValid) {
    return (
      <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
        <Navbar />
        <Sidebar />
        <main className="lg:pl-64 pt-16">
          <div className="p-6 lg:p-8">
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="py-6">
                <p className="text-center text-red-700 dark:text-red-400">
                  Invalid report ID
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  const isLoading = reportLoading || markdownLoading;

  return (
    <div className="min-h-screen bg-silver-50 dark:bg-silver-950">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-16">
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="gap-2 mb-4">
                <ArrowLeft className="h-4 w-4" />
                Back to Reports
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-palkia-500" />
            </div>
          ) : reportError ? (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
              <CardContent className="py-6">
                <p className="text-center text-red-700 dark:text-red-400">
                  Failed to load report. Is the backend running?
                </p>
              </CardContent>
            </Card>
          ) : report ? (
            <div className="space-y-6">
              <Card className="card-palkia">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-2xl">{report.title}</CardTitle>
                        <Badge variant="palkia">v{report.version}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-silver-500 dark:text-silver-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(report.created_at)}
                        </span>
                        <Link 
                          href={`/knowledge-bases/${report.knowledge_base_id}`}
                          className="flex items-center gap-1 hover:text-palkia-600 dark:hover:text-palkia-400"
                        >
                          <Database className="h-4 w-4" />
                          View Knowledge Base
                        </Link>
                      </div>
                    </div>
                    <Button 
                      variant="gradient" 
                      onClick={handleDownload}
                      className="shrink-0"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Markdown
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {report.executive_summary && (
                <Card className="card-palkia">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-palkia-500" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-silver-700 dark:text-silver-300 leading-relaxed">
                      {report.executive_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {markdown?.markdown_content && (
                <Card className="card-palkia">
                  <CardHeader>
                    <CardTitle className="text-lg">Full Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-silver dark:prose-invert max-w-none">
                      <MarkdownRenderer content={markdown.markdown_content} />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-silver-100 dark:bg-silver-800">
                    <FileText className="h-6 w-6 text-silver-400" />
                  </div>
                  <h3 className="text-lg font-medium text-silver-900 dark:text-silver-100">
                    Report not found
                  </h3>
                  <p className="mt-1 text-sm text-silver-500">
                    The report you&apos;re looking for doesn&apos;t exist or has been deleted.
                  </p>
                  <Link href="/reports" className="mt-4 inline-block">
                    <Button variant="gradient">
                      Back to Reports
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

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = "";

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${index}`} className="bg-silver-100 dark:bg-silver-800 rounded-lg p-4 overflow-x-auto my-4">
            <code className="text-sm font-mono text-silver-800 dark:text-silver-200">
              {codeContent.join("\n")}
            </code>
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLanguage = line.slice(3);
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-2xl font-bold mt-8 mb-4 text-silver-900 dark:text-silver-100">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-xl font-semibold mt-6 mb-3 text-silver-900 dark:text-silver-100">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-silver-900 dark:text-silver-100">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={index} className="ml-4 text-silver-700 dark:text-silver-300">
          {line.slice(2)}
        </li>
      );
    } else if (line.match(/^\d+\. /)) {
      elements.push(
        <li key={index} className="ml-4 list-decimal text-silver-700 dark:text-silver-300">
          {line.replace(/^\d+\. /, "")}
        </li>
      );
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-palkia-300 dark:border-palkia-700 pl-4 my-4 italic text-silver-600 dark:text-silver-400">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={index} className="h-2" />);
    } else {
      elements.push(
        <p key={index} className="text-silver-700 dark:text-silver-300 leading-relaxed my-2">
          {formatInlineMarkdown(line)}
        </p>
      );
    }
  });

  return <div className="space-y-1">{elements}</div>;
}

function formatInlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyCounter = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/\*(.+?)\*/);
    const codeMatch = remaining.match(/`(.+?)`/);

    const matches = [
      boldMatch ? { type: "bold", match: boldMatch, index: boldMatch.index! } : null,
      italicMatch ? { type: "italic", match: italicMatch, index: italicMatch.index! } : null,
      codeMatch ? { type: "code", match: codeMatch, index: codeMatch.index! } : null,
    ].filter(Boolean).sort((a, b) => a!.index - b!.index);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    const first = matches[0]!;
    
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index));
    }

    if (first.type === "bold") {
      parts.push(<strong key={keyCounter++} className="font-semibold">{first.match![1]}</strong>);
    } else if (first.type === "italic") {
      parts.push(<em key={keyCounter++}>{first.match![1]}</em>);
    } else if (first.type === "code") {
      parts.push(
        <code key={keyCounter++} className="bg-silver-100 dark:bg-silver-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {first.match![1]}
        </code>
      );
    }

    remaining = remaining.slice(first.index + first.match![0].length);
  }

  return parts.length === 1 ? parts[0] : parts;
}
