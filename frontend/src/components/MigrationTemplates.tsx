import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, Plus } from 'lucide-react';
import { T__3 } from '../backend';

interface Template {
  name: string;
  type: T__3;
  description: string;
  config: string;
}

const templates: Template[] = [
  {
    name: 'Create Users Collection',
    type: T__3.create_collection,
    description: 'Create a new users collection with basic schema',
    config: JSON.stringify(
      {
        collection: 'users',
        schema: {
          name: 'string',
          email: 'string',
          createdAt: 'date',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'Add Email Field',
    type: T__3.add_field,
    description: 'Add an email field to existing collection',
    config: JSON.stringify(
      {
        collection: 'users',
        field: 'email',
        type: 'string',
        required: true,
        unique: true,
      },
      null,
      2
    ),
  },
  {
    name: 'Remove Deprecated Field',
    type: T__3.remove_field,
    description: 'Remove a deprecated field from collection',
    config: JSON.stringify(
      {
        collection: 'users',
        field: 'oldField',
      },
      null,
      2
    ),
  },
  {
    name: 'Rename Field',
    type: T__3.rename_field,
    description: 'Rename a field in existing collection',
    config: JSON.stringify(
      {
        collection: 'users',
        oldName: 'username',
        newName: 'displayName',
      },
      null,
      2
    ),
  },
  {
    name: 'Create Email Index',
    type: T__3.create_index,
    description: 'Create an index on email field for faster queries',
    config: JSON.stringify(
      {
        collection: 'users',
        field: 'email',
        unique: true,
        sparse: false,
      },
      null,
      2
    ),
  },
];

interface MigrationTemplatesProps {
  onSelectTemplate: (template: { type: T__3; config: string }) => void;
}

export default function MigrationTemplates({ onSelectTemplate }: MigrationTemplatesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          Migration Templates
        </CardTitle>
        <CardDescription>Quick start with common migration patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {templates.map((template, index) => (
              <div
                key={index}
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-xs">
                      {template.config}
                    </pre>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onSelectTemplate({
                        type: template.type,
                        config: template.config,
                      })
                    }
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Use
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
