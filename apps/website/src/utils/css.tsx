import { dynamic, type ComponentProps, type JSX, type ValidComponent } from '@solidjs/web';

export function styled<C extends ValidComponent>(Component: C, ...classes: string[]) {
  const Host = dynamic(() => Component);
  return (props: ComponentProps<C> & { class?: JSX.IntrinsicElements['div']['class'] }) => <Host {...props} class={[props.class, classes]} />;
}
