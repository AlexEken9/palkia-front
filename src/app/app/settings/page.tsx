"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Label,
  Input,
} from "@/components/ui";
import { siteConfig, apiConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your preferences and configuration
        </p>
      </div>

      <div className="space-y-6">
        <Card className="card-palkia">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how Palkia looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Theme</Label>
              {mounted && (
                <div className="grid grid-cols-3 gap-3">
                  {themes.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setTheme(value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                        theme === value
                          ? "border-palkia-500 bg-palkia-50 dark:bg-palkia-900/20"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <Icon className={cn(
                        "h-6 w-6",
                        theme === value ? "text-palkia-500" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-sm font-medium",
                        theme === value ? "text-palkia-700 dark:text-palkia-300" : "text-muted-foreground"
                      )}>
                        {label}
                      </span>
                      {theme === value && (
                        <Check className="h-4 w-4 text-palkia-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-palkia">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Backend API connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="api-url">API Base URL</Label>
                <Input
                  id="api-url"
                  value={apiConfig.baseUrl}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Set via NEXT_PUBLIC_API_URL environment variable
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="api-version">API Version</Label>
                <Input
                  id="api-version"
                  value={apiConfig.version}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-palkia">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Application information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application</span>
                <span className="font-medium text-foreground">{siteConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium text-foreground">{siteConfig.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GitHub</span>
                <a 
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-palkia-500 hover:underline"
                >
                  View Repository
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
