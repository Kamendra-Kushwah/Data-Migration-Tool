import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Shield } from 'lucide-react';
import { useGetAllValidationResults } from '../hooks/useQueries';

export default function ValidationResults() {
  const { data: validationResults = [], isLoading } = useGetAllValidationResults();

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
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Validation Results
        </CardTitle>
        <CardDescription>Pre-migration and post-migration validation checks</CardDescription>
      </CardHeader>
      <CardContent>
        {validationResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No validation results yet</h3>
            <p className="text-sm text-muted-foreground">Execute migrations to see validation results</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {validationResults.map((result) => (
                <div key={Number(result.migrationId)} className="space-y-4 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Migration ID: {Number(result.migrationId)}</h3>
                    <Badge variant="outline">
                      {new Date(Number(result.timestamp) / 1000000).toLocaleString()}
                    </Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-md border p-3">
                      {result.preCheck ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Pre-Migration Check</p>
                        <p className="text-xs text-muted-foreground">
                          {result.preCheck ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border p-3">
                      {result.postCheck ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium">Post-Migration Check</p>
                        <p className="text-xs text-muted-foreground">
                          {result.postCheck ? 'Passed' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {result.warnings.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Warnings:</p>
                      {result.warnings.map((warning, idx) => (
                        <Alert key={idx} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>{warning}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
