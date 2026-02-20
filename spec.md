# Migration Management Tool Simulator

A web application that simulates a migration management tool for Express.js users, providing an educational environment to learn database migration concepts without requiring external database or Git connections.

## Core Features

### Migration Designer
- Web interface for defining schema changes that mimics Express route design patterns
- Pre-built templates for common migration operations:
  - Create collection
  - Add/remove field
  - Rename field
  - Index creation
- Form-based migration configuration with validation

### Storage System
- Backend stores migration templates and configurations
- Simulates MongoDB document storage using native data structures
- Persists migration definitions, execution history, and logs

### Migration Queue System
- Mock asynchronous migration execution with realistic state transitions
- Migration states: Pending, Running, Completed, Failed
- Detailed execution logs for each migration with timestamps
- Simulated processing delays to demonstrate real-world behavior

### Version Control Simulation
- Track migrations with simulated Git-like commit history
- Each migration gets a unique version identifier
- Rollback functionality to revert to previous migration versions
- Visual commit timeline showing migration progression

### Validation System
- Mock pre-migration and post-migration data validation checks
- Simulated structure comparison with highlighted anomalies
- Mock Unix file permission validation for migration scripts
- Randomized validation warnings for demonstration purposes

### Logging and Monitoring
- Comprehensive visual timeline of all migration activities
- Real-time status updates during migration execution
- Simulated data corruption detection with warning alerts
- Detailed audit trail for all operations

## User Interface

### Dashboard Layout
Four main tabs:
1. **Design Migration** - Create and configure new migrations
2. **Migration Queue** - View and manage pending/running migrations
3. **History/Logs** - Browse migration history and detailed logs
4. **Validation Results** - Review validation checks and warnings

### Interactive Features
- Real-time progress indicators during migration execution
- One-click rollback controls with confirmation dialogs
- Migration template library with search and filtering
- Export/import migration configurations

## Backend Data Storage

The backend must store:
- Migration templates and configurations
- Migration execution history and status
- Detailed logs for each migration run
- Simulated Git commit history
- Validation results and warnings
- User-created migration definitions

## Simulation Behavior

All processes are simulated for educational purposes:
- No actual database connections required
- Realistic timing delays for migration execution
- Randomized success/failure scenarios for demonstration
- Mock validation results with educational examples
