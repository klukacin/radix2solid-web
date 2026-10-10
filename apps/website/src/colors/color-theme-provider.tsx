import { createContext, createEffect, createMemo, createSignal, onSettled, untrack, useContext, type Element } from 'solid-js';
import { isServer } from '@solidjs/web';
import { useSiteContext } from '../components/site-context.js';
import { generateRadixColors } from './generate-radix-colors.ts';
import { defaultPalette, readPaletteCookie, writePaletteCookie, type Palette } from './palette-cookie.ts';
import { applyPaletteParams, buildPaletteSearchParams } from './palette-url.ts';
import { getColorName } from './utils.ts';

type GeneratedColors = ReturnType<typeof generateRadixColors>;
interface ColorThemeValue {
  ready: boolean;
  result: GeneratedColors;
  darkModeResult: GeneratedColors;
  lightModeResult: GeneratedColors;
  appearance: 'light' | 'dark';
  accent: ReturnType<typeof getColorName>;
  accentValue: string;
  grayValue: string;
  bgValue: string;
  setAccentValue: (value: string) => void;
  setGrayValue: (value: string) => void;
  setBgValue: (value: string) => void;
}
const ColorThemeContext = createContext<ColorThemeValue | null>(null);
export function useColorThemeContext(): ColorThemeValue {
  const context = useContext(ColorThemeContext);
  if (!context) throw new Error('Color controls require ColorThemeProvider.');
  return context;
}

export function ColorThemeProvider(props: { children: Element }) {
  const site = useSiteContext();
  const [palette, setPalette] = createSignal<Palette>(defaultPalette);
  const [ready, setReady] = createSignal(false);
  const isDark = () => site.ready && site.resolvedTheme === 'dark';
  const lightAccent = createMemo(() => palette().lightAccent);
  const lightGray = createMemo(() => palette().lightGray);
  const lightBg = createMemo(() => palette().lightBg);
  const darkAccent = createMemo(() => palette().darkAccent);
  const darkGray = createMemo(() => palette().darkGray);
  const darkBg = createMemo(() => palette().darkBg);
  const lightModeResult = createMemo(() => generateRadixColors({
    appearance: 'light', accent: lightAccent(), gray: lightGray(), background: lightBg(),
  }));
  const darkModeResult = createMemo(() => generateRadixColors({
    appearance: 'dark', accent: darkAccent(), gray: darkGray(), background: darkBg(),
  }));
  const accent = createMemo(() => getColorName(lightModeResult().accentScale[8]));
  function updatePalette(light: keyof Palette, dark: keyof Palette, value: string) {
    untrack(() => {
      if (!ready()) return;
      const next = { ...palette(), [isDark() ? dark : light]: value };
      setPalette(next);
      writePaletteCookie(next);
    });
  }
  const context: ColorThemeValue = {
    get ready() { return ready() && site.ready; },
    get result() { return isDark() ? darkModeResult() : lightModeResult(); },
    get darkModeResult() { return darkModeResult(); },
    get lightModeResult() { return lightModeResult(); },
    get appearance() { return isDark() ? 'dark' : 'light'; },
    get accent() { return accent(); },
    get accentValue() { return isDark() ? darkAccent() : lightAccent(); },
    get grayValue() { return isDark() ? darkGray() : lightGray(); },
    get bgValue() { return isDark() ? darkBg() : lightBg(); },
    setAccentValue: value => updatePalette('lightAccent', 'darkAccent', value),
    setGrayValue: value => updatePalette('lightGray', 'darkGray', value),
    setBgValue: value => updatePalette('lightBg', 'darkBg', value),
  };
  if (!isServer) createEffect(() => ready() ? palette() : undefined, current => {
    if (!current) return;
    const search = new URLSearchParams(location.search);
    const next = buildPaletteSearchParams(current, search).toString();
    if (next === search.toString()) return;
    history.replaceState(history.state, '', location.pathname + (next ? `?${next}` : '') + location.hash);
  }, { transparent: true });
  onSettled(() => {
    setPalette(applyPaletteParams(readPaletteCookie(), new URLSearchParams(location.search)));
    setReady(true);
  });
  return <ColorThemeContext value={context}>{props.children}</ColorThemeContext>;
}
