import { createContext, createEffect, createSignal, onSettled, useContext, type Element } from 'solid-js';
import { isServer } from '@solidjs/web';
import { useThemeContext } from '@radix-solid/themes';

type Appearance = 'light' | 'dark';
type Preference = Appearance | 'system';
interface SiteContextValue {
  path: string;
  theme: Preference;
  systemTheme: Appearance;
  resolvedTheme: Appearance;
  ready: boolean;
  setTheme: (value: Preference) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean | ((current: boolean) => boolean)) => void;
}
const SiteContext = createContext<SiteContextValue | null>(null);
export function useSiteContext(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) throw new Error('Site controls require SiteProvider.');
  return context;
}

function initializeAppearance() {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') preference = saved;
  } catch { /* Storage is optional. */ }
  const appearance = preference === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preference;
  const root = document.documentElement;
  root.classList.remove('light-theme', 'dark-theme');
  root.classList.add(`${appearance}-theme`);
  root.style.colorScheme = appearance;
  root.dataset.appearancePreference = preference;
}
export const appearanceScript = `(${initializeAppearance.toString()})();`;

export function SiteProvider(props: { path: string; children: Element }) {
  const [theme, setPreference] = createSignal<Preference>('system');
  const [systemTheme, setSystemTheme] = createSignal<Appearance>('light');
  const [ready, setReady] = createSignal(false);
  const [mobileOpen, setMobileOpen] = createSignal(false);
  const resolvedTheme = () => theme() === 'system' ? systemTheme() : theme() as Appearance;
  const context: SiteContextValue = {
    get path() { return props.path; },
    get theme() { return theme(); },
    get systemTheme() { return systemTheme(); },
    get resolvedTheme() { return resolvedTheme(); },
    get ready() { return ready(); },
    get mobileOpen() { return mobileOpen(); },
    setMobileOpen,
    setTheme(value) {
      setPreference(value);
      try { localStorage.setItem('theme', value); } catch { /* Storage is optional. */ }
    },
  };
  if (!isServer) createEffect(() => ready() ? resolvedTheme() : undefined, appearance => {
    if (!appearance) return;
    const root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${appearance}-theme`);
    root.style.colorScheme = appearance;
  }, { transparent: true });
  onSettled(() => {
    const saved = document.documentElement.dataset.appearancePreference;
    if (saved === 'light' || saved === 'dark' || saved === 'system') setPreference(saved);
    const media = matchMedia('(prefers-color-scheme: dark)');
    const desktop = matchMedia('(min-width: 1024px)');
    const appearanceChanged = () => setSystemTheme(media.matches ? 'dark' : 'light');
    const viewportChanged = () => { if (desktop.matches) setMobileOpen(false); };
    const storageChanged = (event: StorageEvent) => {
      if (event.key !== 'theme') return;
      const value = event.newValue;
      setPreference(value === 'light' || value === 'dark' ? value : 'system');
    };
    appearanceChanged();
    setReady(true);
    media.addEventListener('change', appearanceChanged);
    desktop.addEventListener('change', viewportChanged);
    window.addEventListener('storage', storageChanged);
    return () => {
      media.removeEventListener('change', appearanceChanged);
      desktop.removeEventListener('change', viewportChanged);
      window.removeEventListener('storage', storageChanged);
    };
  });
  return <SiteContext value={context}>{props.children}</SiteContext>;
}

export function ThemePreferenceSync() {
  const site = useSiteContext();
  const theme = useThemeContext();
  if (!isServer) createEffect(() => site.ready ? site.resolvedTheme : undefined, appearance => {
    if (appearance) theme.onAppearanceChange(appearance);
  }, { transparent: true });
  return null;
}
