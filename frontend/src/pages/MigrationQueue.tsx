import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useGetAllMigrations, useExecuteMigration, useRollbackMigration } from '../hooks/useQueries';
import { T } from '../backend';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const statusConfig = {
  [T.pending]: { label: 'Pending', icon: Clock, color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
  [T.running]: { label: 'Running', icon: Loader2, color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  [T.completed]: { label: 'Completed', icon: CheckCircle2, color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  [T.failed]: { label: 'Failed', icon: XCircle, color: 'bg-red-500/10 text-red-700 dark:text-red-400' },
};

export default function MigrationQueue() {
  const { data: migrations = [], isLoading } = useGetAllMigrations();
  const executeMigration = useExecuteMigration();
  const rollbackMigration = useRollbackMigration();

  const handleExecute = async (id: bigint) => {
    try {
      await executeMigration.mutateAsync(id);
      toast.success('Migration execution started');
    } catch (error) {
      toast.error('Failed to execute migration');
      console.error(error);
    }
  };

  const handleRollback = async (id: bigint) => {
    try {
      await rollbackMigration.mutateAsync(id);
      toast.success('Migration rolled back successfully');
    } catch (error) {
      toast.error('Failed to rollback migration');
      console.error(error);
    }
  };

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
    <Card>
      <CardHeader>
        <CardTitle>Migration Queue</CardTitle>
        <CardDescription>Monitor and manage migration execution status</CardDescription>
      </CardHeader>
      <CardContent>
        {migrations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No migrations yet</h3>
            <p className="text-sm text-muted-foreground">Create your first migration to get started</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {migrations.map((migration, index) => {
                const status = statusConfig[migration.status];
                const StatusIcon = status.icon;

                return (
                  <div key={Number(migration.id)}>
                    <div className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">{migration.name}</h3>
                          <Badge variant="outline" className={status.color}>
                            <StatusIcon className={`mr-1 h-3 w-3 ${migration.status === T.running ? 'animate-spin' : ''}`} />
                            {status.label}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>Type: {migration.migrationType}</p>
                          <p>Version: {Number(migration.version)}</p>
                          <p>Created: {new Date(Number(migration.createdAt) / 1000000).toLocaleString()}</p>
                        </div>
                        {migration.logs.length > 0 && (
                          <div className="mt-2 rounded-md bg-muted p-2">
                            <p className="text-xs font-medium">Latest Log:</p>
                            <p className="text-xs text-muted-foreground">{migration.logs[migration.logs.length - 1]}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        {migration.status === T.pending && (
                          <Button
                            size="sm"
                            onClick={() => handleExecute(migration.id)}
                            disabled={executeMigration.isPending}
                          >
                            <Play className="mr-1 h-3 w-3" />
                            Execute
                          </Button>
                        )}
                        {migration.status === T.completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRollback(migration.id)}
                            disabled={rollbackMigration.isPending}
                          >
                            <RotateCcw className="mr-1 h-3 w-3" />
                            Rollback
                          </Button>
                        )}
                      </div>
                    </div>
                    {index < migrations.length - 1 && <Separator className="my-4" />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
