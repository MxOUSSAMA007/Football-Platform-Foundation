import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { PlatformShell, usePreferences } from '@/components/platform-shell';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import MatchesPage from '@/pages/matches-page';
import MorePage from '@/pages/more-page';
import { PlaceholderPage } from '@/components/placeholder-page';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function LocalizedPlaceholder({ kind }: { kind: 'news' | 'leagues' | 'following' }) {
  const { language } = usePreferences();
  return <PlaceholderPage kind={kind} language={language} />;
}

function Router() {
  return <RoutedErrorBoundary><PlatformShell><Switch><Route path="/" component={MatchesPage} /><Route path="/news"><LocalizedPlaceholder kind="news" /></Route><Route path="/leagues"><LocalizedPlaceholder kind="leagues" /></Route><Route path="/following"><LocalizedPlaceholder kind="following" /></Route><Route path="/more" component={MorePage} /><Route component={NotFound} /></Switch></PlatformShell></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
