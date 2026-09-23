import { Clock3, Radio, Shield } from 'lucide-react';
import type { Match } from '@workspace/api-client-react';
import { getTranslations, type Language } from '@/lib/i18n';

function TeamMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const initials = name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  if (logoUrl) return <img src={logoUrl} alt="" className="size-9 rounded-full object-contain" />;
  return <div className="grid size-9 place-items-center rounded-full border border-border bg-muted text-[10px] font-bold text-muted-foreground">{initials}</div>;
}

export function MatchCard({ match, language }: { match: Match; language: Language }) {
  const isLive = match.status === 'LIVE' || match.status === 'HALFTIME';
  const translations = getTranslations(language);
  const status = translations.status[match.status] ?? match.status;
  const kickoff = new Date(match.kickoff).toLocaleTimeString(language === 'ar' ? 'ar' : language, { hour: '2-digit', minute: '2-digit', hour12: false });
  const score = (value: number | null) => value === null ? '—' : value;
  return (
    <article className={`score-card rise-in rounded-2xl border bg-card p-4 shadow-sm ${isLive ? 'border-primary/45 bg-card' : 'border-card-border'}`} data-testid={`card-match-${match.id}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`size-1.5 shrink-0 rounded-full ${isLive ? 'bg-destructive live-pulse' : 'bg-muted-foreground/35'}`} />
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.09em] text-muted-foreground">{match.leagueName}</span>
          {match.leagueCountry && <span className="hidden truncate text-[10px] text-muted-foreground/55 sm:inline">/ {match.leagueCountry}</span>}
        </div>
        <span className={`mono-font shrink-0 text-[10px] font-medium uppercase tracking-[0.12em] ${isLive ? 'text-destructive' : 'text-muted-foreground'}`}>{isLive && <Radio className="me-1 inline size-3" />}{match.status === 'LIVE' && match.minute ? `${match.minute}'` : status}</span>
      </div>
      <div className="grid grid-cols-[1fr_58px_1fr] items-center gap-3 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <TeamMark name={match.homeTeam.name} logoUrl={match.homeTeam.logoUrl} />
          <span className="min-w-0 truncate text-sm font-semibold">{match.homeTeam.shortName || match.homeTeam.name}</span>
        </div>
        <div className="text-center">
          {isLive || match.status === 'FULL_TIME' ? <div className="display-font text-2xl font-bold tracking-tight" data-testid={`text-score-${match.id}`}>{score(match.score.home)}<span className="mx-1 text-muted-foreground/40">:</span>{score(match.score.away)}</div> : <div className="mono-font text-lg font-medium tracking-tight">{kickoff}</div>}
          {match.status === 'HALFTIME' && <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{status}</div>}
        </div>
        <div className="flex min-w-0 flex-row-reverse items-center gap-3 text-end">
          <TeamMark name={match.awayTeam.name} logoUrl={match.awayTeam.logoUrl} />
          <span className="min-w-0 truncate text-sm font-semibold">{match.awayTeam.shortName || match.awayTeam.name}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><Clock3 className="size-3" /> {match.round || translations.matchCard.matchday}</span>
        <span className="flex items-center gap-1.5"><Shield className="size-3" /> {match.sourceLabel}</span>
      </div>
    </article>
  );
}

export function MatchSkeleton({ index }: { index: number }) {
  return <div className="rounded-2xl border border-border bg-card p-4" data-testid={`skeleton-match-${index}`}><div className="skeleton-shimmer h-3 w-1/3 rounded" /><div className="mt-5 flex items-center justify-between"><div className="skeleton-shimmer h-9 w-32 rounded-full" /><div className="skeleton-shimmer size-8 rounded" /><div className="skeleton-shimmer h-9 w-32 rounded-full" /></div><div className="mt-4 flex justify-between"><div className="skeleton-shimmer h-2 w-20 rounded" /><div className="skeleton-shimmer h-2 w-20 rounded" /></div></div>;
}