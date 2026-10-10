import { Primitive, type PrimitiveProps } from '@radix-solid/primitives/internal';
import { omit } from 'solid-js';
import styles from './logo-link.module.css';

export type LogoLinkProps = PrimitiveProps<'a'> & { variant?: 'normal' | 'box' };
export function LogoLink(props: LogoLinkProps) {
  return <Primitive {...omit(props, 'variant')} as="a" class={[styles.LogoLink, props.class]} data-variant={props.variant ?? 'normal'} />;
}
