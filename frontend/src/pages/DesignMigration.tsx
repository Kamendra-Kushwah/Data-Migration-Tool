import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileCode, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateMigration } from '../hooks/useQueries';
import { T__3 } from '../backend';
import MigrationTemplates from '../components/MigrationTemplates';

const migrationTypeLabels: Record<T__3, string> = {
  [T__3.create_collection]: 'Create Collection',
  [T__3.add_field]: 'Add Field',
  [T__3.remove_field]: 'Remove Field',
  [T__3.rename_field]: 'Rename Field',
  [T__3.create_index]: 'Create Index',
};

export default function DesignMigration() {
  const [name, setName] = useState('');
  const [migrationType, setMigrationType] = useState<T__3 | ''>('');
  const [config, setConfig] = useState('');

  const createMigration = useCreateMigration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a migration name');
      return;
    }

    if (!migrationType) {
      toast.error('Please select a migration type');
      return;
    }

    if (!config.trim()) {
      toast.error('Please enter migration configuration');
      return;
    }

    try {
      await createMigration.mutateAsync({
        name: name.trim(),
        migrationType,
        config: config.trim(),
      });

      toast.success('Migration created successfully!');
      setName('');
      setMigrationType('');
      setConfig('');
    } catch (error) {
      toast.error('Failed to create migration');
      console.error(error);
    }
  };

  const handleTemplateSelect = (template: { type: T__3; config: string }) => {
    setMigrationType(template.type);
    setConfig(template.config);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Create New Migration
          </CardTitle>
          <CardDescription>Define schema changes for your Express.js application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Migration Name</Label>
              <Input
                id="name"
                placeholder="e.g., add_user_email_field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Migration Type</Label>
              <Select value={migrationType} onValueChange={(value) => setMigrationType(value as T__3)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select migration type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(migrationTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="config">Configuration (JSON)</Label>
              <Textarea
                id="config"
                placeholder='{"collection": "users", "field": "email", "type": "string"}'
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            <Button type="submit" className="w-full" disabled={createMigration.isPending}>
              {createMigration.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Migration
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <MigrationTemplates onSelectTemplate={handleTemplateSelect} />
    </div>
  );
}
