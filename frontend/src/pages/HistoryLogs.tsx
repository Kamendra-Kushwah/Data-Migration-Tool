import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { History, GitCommit, Loader2, FileText } from 'lucide-react';
import { useGetAllCommits, useGetAllMigrations } from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoryLogs() {
  const { data: commits = [], isLoading: commitsLoading } = useGetAllCommits();
  const { data: migrations = [], isLoading: migrationsLoading } = useGetAllMigrations();

  const isLoading = commitsLoading || migrationsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCommit className="h-5 w-5" />
            Commit History
          </CardTitle>
          <CardDescription>Simulated Git commits for migration versions</CardDescription>
        </CardHeader>
        <CardContent>
          {commits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <GitCommit className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No commits yet</h3>
              <p className="text-sm text-muted-foreground">Execute migrations to create commit history</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {commits.map((commit, index) => (
                  <div key={Number(commit.id)}>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <GitCommit className="h-4 w-4" />
                        </div>
                        {index < commits.length - 1 && <div className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{Number(commit.id)}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(Number(commit.timestamp) / 1000000).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2 font-medium">{commit.message}</p>
                        <p className="text-sm text-muted-foreground">Migration ID: {Number(commit.migrationId)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Migration Logs
          </CardTitle>
          <CardDescription>Detailed execution logs for all migrations</CardDescription>
        </CardHeader>
        <CardContent>
          {migrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No logs yet</h3>
              <p className="text-sm text-muted-foreground">Migration logs will appear here</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {migrations.map((migration) => (
                  <div key={Number(migration.id)} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{migration.name}</h4>
                      <Badge variant="secondary">ID: {Number(migration.id)}</Badge>
                    </div>
                    {migration.logs.length > 0 ? (
                      <div className="space-y-1 rounded-lg bg-muted p-3">
                        {migration.logs.map((log, idx) => (
                          <p key={idx} className="text-xs font-mono text-muted-foreground">
                            {log}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No logs available</p>
                    )}
                    <Separator />
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
