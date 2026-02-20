import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import DesignMigration from './pages/DesignMigration';
import MigrationQueue from './pages/MigrationQueue';
import HistoryLogs from './pages/HistoryLogs';
import ValidationResults from './pages/ValidationResults';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight">Migration Management Tool</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Simulate and manage database migrations for Express.js applications
              </p>
            </div>

            <Tabs defaultValue="design" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="design">Design Migration</TabsTrigger>
                <TabsTrigger value="queue">Migration Queue</TabsTrigger>
                <TabsTrigger value="history">History/Logs</TabsTrigger>
                <TabsTrigger value="validation">Validation Results</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="mt-6">
                <DesignMigration />
              </TabsContent>

              <TabsContent value="queue" className="mt-6">
                <MigrationQueue />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <HistoryLogs />
              </TabsContent>

              <TabsContent value="validation" className="mt-6">
                <ValidationResults />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
