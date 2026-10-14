import { Button } from '@wsagency/radix2solid-themes';
import type { ComponentProps } from 'solid-js';
import styles from './colors-marketing-button.module.css';

export function ColorsMarketingButton(props: ComponentProps<typeof Button>) {
  return <Button color="gray" highContrast {...props} class={[styles.ColorsMarketingButton, props.class]} />;
}
