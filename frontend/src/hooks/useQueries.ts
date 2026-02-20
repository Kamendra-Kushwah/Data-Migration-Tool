import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { T__2, T__3, T, T__4, T__1 } from '../backend';

export function useGetAllMigrations() {
  const { actor, isFetching } = useActor();

  return useQuery<T__2[]>({
    queryKey: ['migrations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMigrations();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMigration(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<T__2>({
    queryKey: ['migration', id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getMigration(id);
    },
    enabled: !!actor && !isFetching && id !== undefined,
  });
}

export function useCreateMigration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      migrationType,
      config,
    }: {
      name: string;
      migrationType: T__3;
      config: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createMigration(name, migrationType, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['migrations'] });
    },
  });
}

export function useExecuteMigration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');

      // Update status to running
      await actor.updateMigrationStatus(id, T.running);
      await actor.addMigrationLog(id, 'Migration execution started');

      // Simulate migration execution with delays
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await actor.addMigrationLog(id, 'Validating migration configuration...');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await actor.addMigrationLog(id, 'Connecting to database...');

      await new Promise((resolve) => setTimeout(resolve, 1500));
      await actor.addMigrationLog(id, 'Executing schema changes...');

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await actor.addMigrationLog(id, 'Running post-migration checks...');

      // Randomly succeed or fail for demonstration
      const success = Math.random() > 0.2;

      if (success) {
        await actor.updateMigrationStatus(id, T.completed);
        await actor.addMigrationLog(id, 'Migration completed successfully');

        // Add commit
        const migration = await actor.getMigration(id);
        await actor.addCommit(id, `feat: ${migration.name}`);

        // Add validation result
        const warnings: string[] = [];
        if (Math.random() > 0.7) {
          warnings.push('Data corruption detected in 0.01% of records');
        }
        if (Math.random() > 0.8) {
          warnings.push('File permissions may need adjustment for migration scripts');
        }
        await actor.addValidationResult(id, true, true, warnings);
      } else {
        await actor.updateMigrationStatus(id, T.failed);
        await actor.addMigrationLog(id, 'Migration failed: Simulated error for demonstration');

        // Add validation result with failure
        await actor.addValidationResult(id, true, false, [
          'Post-migration validation failed',
          'Schema mismatch detected',
        ]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['migrations'] });
      queryClient.invalidateQueries({ queryKey: ['commits'] });
      queryClient.invalidateQueries({ queryKey: ['validationResults'] });
    },
  });
}

export function useRollbackMigration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not initialized');

      await actor.addMigrationLog(id, 'Initiating rollback...');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await actor.addMigrationLog(id, 'Reverting schema changes...');
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await actor.updateMigrationStatus(id, T.pending);
      await actor.addMigrationLog(id, 'Rollback completed successfully');

      // Add rollback commit
      const migration = await actor.getMigration(id);
      await actor.addCommit(id, `revert: ${migration.name}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['migrations'] });
      queryClient.invalidateQueries({ queryKey: ['commits'] });
    },
  });
}

export function useGetAllCommits() {
  const { actor, isFetching } = useActor();

  return useQuery<T__4[]>({
    queryKey: ['commits'],
    queryFn: async () => {
      if (!actor) return [];
      const commits = await actor.getAllCommits();
      return commits.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllValidationResults() {
  const { actor, isFetching } = useActor();

  return useQuery<T__1[]>({
    queryKey: ['validationResults'],
    queryFn: async () => {
      if (!actor) return [];
      const results = await actor.getAllValidationResults();
      return results.sort((a, b) => Number(b.timestamp - a.timestamp));
    },
    enabled: !!actor && !isFetching,
  });
}
