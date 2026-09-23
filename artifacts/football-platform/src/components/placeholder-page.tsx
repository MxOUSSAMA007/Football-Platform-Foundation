import { ArrowUpRight, Newspaper, Trophy, UsersRound } from 'lucide-react';
import { Link } from 'wouter';
import { getTranslations, type Language } from '@/lib/i18n';

export function PlaceholderPage({ kind, language = 'en' }: { kind: 'news' | 'leagues' | 'following'; language?: Language }) {
  const translations = getTranslations(language).placeholder;
  const config = {
    news: { icon: Newspaper, ...translations.news },
    leagues: { icon: Trophy, ...translations.leagues },
    following: { icon: UsersRound, ...translations.following },
  }[kind];
  const Icon = config.icon;
  return <section className="rise-in mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:py-24" data-testid={`placeholder-${kind}`}><div className="relative grid size-20 place-items-center rounded-[26px] bg-primary text-primary-foreground shadow-lg"><Icon className="size-8" strokeWidth={1.7} /><span className="absolute -right-1 -top-1 size-3 rounded-full bg-accent ring-4 ring-background" /></div><p className="mono-font mt-8 text-[10px] font-medium uppercase tracking-[0.24em] text-primary">{config.eyebrow}</p><h1 className="display-font mt-4 text-4xl font-bold leading-[1.06] tracking-[-0.04em] sm:text-6xl">{config.title}</h1><p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">{config.body}</p><Link href="/" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5" data-testid={`link-return-from-${kind}`}>{translations.back}<ArrowUpRight className="size-4" /></Link></section>;
}