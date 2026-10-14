import { Primitive, type PrimitiveProps } from '@wsagency/radix2solid-primitives/internal';
import styles from './box-link.module.css';

export type BoxLinkProps = PrimitiveProps<'a'>;
export function BoxLink(props: BoxLinkProps) {
  return <Primitive {...props} as="a" class={[styles.BoxLink, props.class]} />;
}
