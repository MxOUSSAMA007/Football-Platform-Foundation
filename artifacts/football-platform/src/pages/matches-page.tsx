import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useListMatches } from '@workspace/api-client-react';
import { MatchCard, MatchSkeleton } from '@/components/match-card';
import { usePreferences } from '@/components/platform-shell';
import { getTranslations } from '@/lib/i18n';

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateAtOffset(offset: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

export default function MatchesPage() {
  const { language } = usePreferences();
  const [selectedDate, setSelectedDate] = useState(isoDate(dateAtOffset(0)));
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const params = useMemo(() => ({ date: selectedDate }), [selectedDate]);
  const query = useListMatches(params);
  const response = query.data;
  const selected = new Date(`${selectedDate}T12:00:00`);
  const dateFormatter = new Intl.DateTimeFormat(language === 'ar' ? 'ar' : language, { weekday: 'short', day: 'numeric', month: 'short' });
  const displayedMatches = useMemo(() => response?.matches.filter((match) => !showLiveOnly || match.status === 'LIVE' || match.status === 'HALFTIME') ?? [], [response?.matches, showLiveOnly]);
  const groups = useMemo(() => {
    const matches = displayedMatches;
    return matches.reduce<Record<string, typeof matches>>((acc, match) => {
      const key = `${match.leagueName} · ${match.leagueCountry || 'International'}`;
      (acc[key] ||= []).push(match);
      return acc;
    }, {});
  }, [displayedMatches]);
  const labels = getTranslations(language).matches;
  const liveCount = response?.matches.filter((match) => match.status === 'LIVE' || match.status === 'HALFTIME').length ?? 0;

  const shiftDate = (offset: number) => {
    const next = new Date(`${selectedDate}T12:00:00`);
    next.setDate(next.getDate() + offset);
    setSelectedDate(isoDate(next));
  };

  return (
    <div className="space-y-8">
      <section className="rise-in flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary"><span className="size-2 rounded-full bg-primary" /> {dateFormatter.format(selected)}</div>
          <h1 className="display-font mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">{labels.board}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{labels.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => query.refetch()} className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground" data-testid="button-refresh-matches"><RefreshCw className={`size-3.5 ${query.isFetching ? 'animate-spin' : ''}`} /> <span className="hidden sm:inline">{labels.refresh}</span></button>
          <button type="button" onClick={() => setShowLiveOnly((value) => !value)} className={`grid size-10 place-items-center rounded-xl border transition-colors ${showLiveOnly ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:text-foreground'}`} aria-label={labels.filterLive} aria-pressed={showLiveOnly} data-testid="button-filter-matches"><SlidersHorizontal className="size-4" /></button>
        </div>
      </section>

      <section className="flex items-center gap-2 overflow-x-auto pb-1" aria-label={labels.selectDate}>
        <button type="button" onClick={() => shiftDate(-1)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground" aria-label={labels.previousDay} data-testid="button-previous-day"><ChevronLeft className="size-4" /></button>
        {[-1, 0, 1].map((offset) => {
          const date = dateAtOffset(offset);
          const value = isoDate(date);
          const active = value === selectedDate;
          const label = offset === -1 ? labels.yesterday : offset === 0 ? labels.today : labels.tomorrow;
          return <button type="button" key={value} onClick={() => setSelectedDate(value)} className={`min-w-[132px] rounded-xl border px-4 py-2.5 text-start transition-colors ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/40'}`} data-testid={`button-date-${offset}`}><span className={`block text-[10px] font-bold uppercase tracking-[0.16em] ${active ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{label}</span><span className="mt-1 block text-sm font-bold">{dateFormatter.format(date)}</span></button>;
        })}
        <div className="relative shrink-0">
          <CalendarDays className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="h-[61px] w-[148px] rounded-xl border border-border bg-card ps-9 pe-2 text-xs font-semibold outline-none focus:border-primary" aria-label={labels.chooseDate} data-testid="input-select-date" />
        </div>
        <button type="button" onClick={() => shiftDate(1)} className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground" aria-label={labels.nextDay} data-testid="button-next-day"><ChevronRight className="size-4" /></button>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3 border-y border-border/70 py-4">
        <div className="flex items-center gap-3">
          <span className="mono-font text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{labels.all}</span>
          <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold">{response?.matches ? displayedMatches.length : (query.isLoading ? '···' : 0)}</span>
        </div>
        {liveCount > 0 && <div className="flex items-center gap-2 text-xs font-bold text-destructive"><span className="size-2 rounded-full bg-destructive live-pulse" /> {liveCount} {labels.live}</div>}
        {response?.dataMode && <div className="mono-font text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{response.dataMode === 'REAL' ? labels.real : response.dataMode === 'MOCK' ? labels.mock : labels.unavailable}</div>}
      </section>

      {query.isLoading && <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2, 3, 4, 5].map((index) => <MatchSkeleton key={index} index={index} />)}</div>}
      {query.isError && <div className="rounded-2xl border border-destructive/35 bg-destructive/5 px-6 py-10 text-center" data-testid="state-matches-error"><p className="font-bold">{labels.error}</p><p className="mt-2 text-sm text-muted-foreground">{query.error instanceof Error ? query.error.message : labels.providerError}</p><button type="button" onClick={() => query.refetch()} className="mt-5 rounded-xl bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground" data-testid="button-retry-matches">{labels.retry}</button></div>}
      {!query.isLoading && !query.isError && response && displayedMatches.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center" data-testid="state-matches-empty"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground"><CalendarDays className="size-5" /></div><p className="mt-5 font-bold">{labels.noMatches}</p><p className="mt-2 text-sm text-muted-foreground">{labels.noMatchesBody}</p></div>}
      {!query.isLoading && !query.isError && Object.entries(groups).map(([league, matches], index) => <section key={league} className={`rise-in stagger-${Math.min(index + 1, 3)}`}><div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-sm font-bold">{league}</h2><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{matches.length} {labels.fixtures}</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{matches.map((match) => <MatchCard key={match.id} match={match} language={language} />)}</div></section>)}
      {response?.providerMessage && <p className="text-center text-xs text-muted-foreground" data-testid="text-provider-message">{labels.data}: {response.providerMessage}</p>}
    </div>
  );
}