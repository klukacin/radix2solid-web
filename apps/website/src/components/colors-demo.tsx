import { createMemo, omit, type Element } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { Slider as ThemeSlider, Switch } from '@radix-solid/themes';
import { mergeStyles } from '@radix-solid/themes/helpers';
import styles from './colors-demo.module.css';

type Props = JSX.IntrinsicElements['button'] & {
  color: string; variant?: 'soft' | 'outline' | 'solid' | 'ghost'; active?: boolean;
  normalStep?: number; hoverStep?: number; activeStep?: number; invertText?: boolean; icon?: Element | (() => Element);
};
export function MenuItemButton(props: Props) {
  const scale = createMemo(() => {
    const result: Record<string, string> = {};
    for (let step = 1; step <= 12; step++) result[`--color-${step}`] = `var(--${props.color}-${step})`;
    return result;
  });
  return <button {...omit(props, 'color', 'variant', 'active', 'normalStep', 'hoverStep', 'activeStep', 'invertText', 'icon')} type={props.type ?? 'button'} class={[styles.BaseButton, styles.MenuItemButton, props.class]} style={mergeStyles(scale(), props.style)}>{typeof props.icon === 'function' ? props.icon() : props.icon}{props.children}</button>;
}
export const ColorDemo = {
  MenuItemButton,
  ToggleSwitch: () => <Switch aria-label="Example switch" />,
  Slider: () => <ThemeSlider aria-label="Example value" defaultValue={[50]} />
};
