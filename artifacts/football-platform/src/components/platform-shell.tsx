import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Activity, BarChart3, CalendarDays, ChevronDown, CircleHelp, Globe2, Home, Languages, Menu, Moon, Newspaper, Radio, Settings2, Sun, UsersRound, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useHealthCheck } from '@workspace/api-client-react';
import { getTranslations, type Language } from '@/lib/i18n';

type Preferences = { language: Language; setLanguage: (language: Language) => void; dark: boolean; setDark: (dark: boolean | ((value: boolean) => boolean)) => void };
const PreferencesContext = createContext<Preferences | null>(null);

function usePreferenceState() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('pitchline-language') as Language) || 'en');
  const [dark, setDark] = useState(() => localStorage.getItem('pitchline-theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('pitchline-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  useEffect(() => {
    localStorage.setItem('pitchline-theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return { language, setLanguage, dark, setDark };
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  const local = usePreferenceState();
  return context || local;
}

export function PlatformShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const preferences = usePreferenceState();
  const { language, setLanguage, dark, setDark } = preferences;
  const health = useHealthCheck();
  const t = getTranslations(language).shell;

  const nav = useMemo(() => [
    { href: '/', label: t.nav.home, icon: Home, exact: true },
    { href: '/news', label: t.nav.news, icon: Newspaper },
    { href: '/leagues', label: t.nav.leagues, icon: BarChart3 },
    { href: '/following', label: t.nav.following, icon: UsersRound },
    { href: '/more', label: t.nav.more, icon: Settings2 },
  ], [t]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <PreferencesContext.Provider value={preferences}>
    <div className="app-shell min-h-[100dvh] text-foreground">
      <aside className="fixed inset-y-0 start-0 z-30 hidden w-[248px] flex-col border-e border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-24 items-center gap-3 border-b border-sidebar-border px-7">
          <div className="relative grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <span className="text-lg font-bold tracking-[-0.15em]">PL</span>
            <span className="absolute -bottom-1 -end-1 size-2.5 rounded-full bg-destructive ring-2 ring-sidebar" />
          </div>
          <div>
            <div className="display-font text-xl font-bold tracking-tight">pitchline</div>
            <div className="mono-font mt-0.5 text-[9px] uppercase tracking-[0.22em] text-sidebar-foreground/50">{t.matchCompanion}</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-7" aria-label={t.primaryNavigation}>
          <p className="mono-font px-4 pb-3 text-[10px] uppercase tracking-[0.18em] text-sidebar-foreground/40">{t.yourBoard}</p>
          {nav.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? location === href : location.startsWith(href);
            return (
              <Link href={href} key={href} onClick={closeMenu} data-testid={`link-nav-${href.slice(1) || 'matches'}`} className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
                <Icon className="size-[17px]" strokeWidth={active ? 2.5 : 1.8} />
                <span>{label}</span>
                {href === '/' && <span className={`ms-auto size-1.5 rounded-full ${health.isError ? 'bg-destructive' : 'bg-sidebar-primary'}`} />}
              </Link>
            );
          })}
        </nav>
        <div className="m-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className={`size-2 rounded-full ${health.isError ? 'bg-destructive' : 'bg-sidebar-primary live-pulse'}`} />
            {health.isError ? t.degraded : t.connected}
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-sidebar-foreground/48">One clear view of the football day.</p>
        </div>
      </aside>

      <div className="lg:ps-[248px]">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3">
              <button type="button" className="grid size-10 place-items-center rounded-xl border border-border lg:hidden" onClick={() => setMobileOpen((value) => !value)} aria-label={t.openNavigation} data-testid="button-open-navigation">
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
              <div className="flex items-center gap-2 lg:hidden">
                <span className="display-font text-lg font-bold">pitchline</span>
                <span className="size-1.5 rounded-full bg-accent" />
              </div>
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <Activity className="size-3.5 text-primary" />
                <span>{health.isError ? t.degraded : t.connected}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center rounded-xl border border-border bg-card sm:flex">
                <Languages className="ms-3 size-4 text-muted-foreground" />
                <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="h-9 cursor-pointer bg-transparent px-2 text-xs font-semibold outline-none" aria-label={t.language} data-testid="select-language">
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                  <option value="ar">ع</option>
                </select>
              </div>
              <button type="button" onClick={() => setDark((value) => !value)} className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground" aria-label={t.theme} data-testid="button-toggle-theme">
                {dark ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
              </button>
              <div className="hidden size-10 place-items-center rounded-xl bg-primary font-bold text-primary-foreground sm:grid" aria-label={t.profile}>A</div>
            </div>
          </div>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 top-[72px] z-20 bg-sidebar p-5 text-sidebar-foreground lg:hidden">
            <nav className="space-y-2" aria-label={t.mobileNavigation}>
              {nav.map(({ href, label, icon: Icon, exact }) => {
                const active = exact ? location === href : location.startsWith(href);
                return <Link href={href} key={href} onClick={closeMenu} data-testid={`mobile-link-nav-${href.slice(1) || 'matches'}`} className={`flex items-center gap-3 rounded-xl px-4 py-4 font-semibold ${active ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/72'}`}><Icon className="size-5" /><span>{label}</span></Link>;
              })}
            </nav>
            <div className="mt-10 rounded-2xl border border-sidebar-border p-4 text-sm text-sidebar-foreground/65">
              <div className="flex items-center gap-2"><Globe2 className="size-4" /> {t.language}</div>
              <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="mt-3 h-10 w-full rounded-lg bg-sidebar-accent px-3 outline-none" data-testid="select-language-mobile">
                <option value="en">{t.languageNames.en}</option><option value="fr">{t.languageNames.fr}</option><option value="ar">{t.languageNames.ar}</option>
              </select>
            </div>
          </div>
        )}

        <main className="mx-auto min-h-[calc(100dvh-72px)] max-w-[1380px] px-5 pb-28 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-10">{children}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-30 flex h-16 items-center justify-around rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-xl backdrop-blur-xl lg:hidden" aria-label={t.mobileNavigation}>
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? location === href : location.startsWith(href);
          return <Link href={href} key={href} data-testid={`bottom-link-nav-${href.slice(1) || 'matches'}`} className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}><Icon className="size-[17px]" /><span className="truncate">{label}</span></Link>;
        })}
      </nav>
    </div>
    </PreferencesContext.Provider>
  );
}