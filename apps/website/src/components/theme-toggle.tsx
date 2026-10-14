import { IconButton, Tooltip } from '@wsagency/radix2solid-themes';
import { MoonIcon, SunIcon } from '@wsagency/radix2solid-icons';
import { useSiteContext } from './site-context.js';

export function ThemeToggle() {
  const site = useSiteContext();
  return <Tooltip content="Toggle theme">{target => target(IconButton, {
    size: '3', variant: 'ghost', color: 'gray', 'aria-label': 'Toggle theme',
    get disabled() { return !site.ready; },
    onClick: () => {
      const next = site.resolvedTheme === 'dark' ? 'light' : 'dark';
      site.setTheme(next === site.systemTheme ? 'system' : next);
    },
    children: <><SunIcon style={{ display: 'var(--theme-toggle-sun-icon-display)' }} /><MoonIcon style={{ display: 'var(--theme-toggle-moon-icon-display)' }} /></>,
  })}</Tooltip>;
}
