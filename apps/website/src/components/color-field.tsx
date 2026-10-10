import Color from 'colorjs.io';
import { createEffect, createMemo, createSignal, onCleanup, onSettled, omit, untrack, type ComponentProps } from 'solid-js';
import { TextField } from '@radix-solid/themes';
import { composeEventHandlers, composeRefs } from '@radix-solid/primitives/internal';
import styles from './color-field.module.css';

type ColorFieldProps = Omit<ComponentProps<typeof TextField.Root>, 'value' | 'defaultValue'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function toCssFormat(value: string): string {
  if (/^[\da-f]+$/i.test(value)) return `#${value}`;
  return /^(?:a98(?:-rgb)?|display-p3|p3|prophoto(?:-rgb)?|rec2020|srgb(?:-linear)?|xyz(?:-d50|-d65)?)\s/i.test(value) ? `color(${value})` : value;
}
function toShortFormat(value?: string): string | null {
  if (!value) return null;
  const raw = value.trim();
  const hex = raw.replace(/^#/, '');
  if (/^[\da-f]{1,3}$/i.test(hex)) {
    return (hex.length === 3 ? [...hex].map(channel => channel + channel).join('') : hex.repeat(6 / hex.length)).toUpperCase();
  }
  try {
    const color = new Color(toCssFormat(raw));
    if (['srgb', 'hsl', 'hwb'].includes(color.spaceId)) {
      const hex = color.to('srgb').toString({ format: 'hex' }).replace(/^#/, '');
      return (hex.length === 3 || hex.length === 4 ? [...hex].map(channel => channel + channel).join('') : hex).toUpperCase();
    }
    const formatted = color.toString({ precision: 3 });
    return formatted.startsWith('color(') ? formatted.slice(6, -1) : formatted;
  } catch { return null; }
}

export function ColorField(props: ColorFieldProps) {
  const [inputValue, setInputValue] = createSignal(untrack(() => toShortFormat(props.value ?? props.defaultValue) ?? '000000'));
  let committed = untrack(inputValue);
  let input: HTMLInputElement | undefined;
  let preventSelection = false;
  let selectTimer: ReturnType<typeof setTimeout> | undefined;
  const parsed = createMemo(() => toShortFormat(inputValue()));
  const color = createMemo(() => parsed() ?? committed);
  const pickerHex = createMemo(() => {
    const value = new Color(toCssFormat(color())).to('srgb');
    value.alpha = 1;
    return `#${toShortFormat(value.toString({ format: 'hex' }))!}`;
  });
  createEffect(() => props.value, value => {
    const formatted = toShortFormat(value);
    if (formatted) { committed = formatted; setInputValue(formatted); }
  });
  onSettled(() => onCleanup(() => clearTimeout(selectTimer)));
  function selectAfterUpdate() {
    clearTimeout(selectTimer);
    selectTimer = setTimeout(() => input?.select());
  }
  function commit() {
    committed = untrack(color);
    setInputValue(committed);
    props.onValueChange?.(toCssFormat(committed));
  }
  return <div class={styles.ColorFieldRoot} onMouseUp={() => {
    if (!preventSelection && document.activeElement === input && input && input.selectionStart === input.selectionEnd) {
      input.select();
      preventSelection = true;
    }
  }}>
    <TextField.Root {...omit(props, 'value', 'defaultValue', 'onValueChange', 'ref', 'onInput', 'onBlur', 'onKeyDown', 'children')}
      ref={composeRefs(props.ref, element => { input = element; })}
      autocapitalize="none" autocomplete="off" autocorrect="off" type="text" variant="surface"
      placeholder={props.placeholder ?? 'Enter a color'} value={inputValue()} aria-invalid={parsed() === null ? 'true' : props['aria-invalid']}
      onInput={composeEventHandlers<InputEvent>(() => props.onInput, event => setInputValue((event.currentTarget as HTMLInputElement).value))}
      onBlur={composeEventHandlers<FocusEvent>(() => props.onBlur, () => {
        commit();
        preventSelection = false;
        input?.setSelectionRange(0, 0);
      })}
      onKeyDown={composeEventHandlers<KeyboardEvent>(() => props.onKeyDown, event => {
        if (committed === untrack(inputValue)) return;
        if (event.key === 'Enter') {
          commit();
          selectAfterUpdate();
          event.preventDefault();
        } else if (event.key === 'Escape') {
          setInputValue(committed);
          selectAfterUpdate();
          event.stopPropagation();
        }
      })}>
      <TextField.Slot><div class={styles.ColorFieldSwatchWrapper}>
        <input type="color" aria-label="Choose color" tabindex={-1} class={styles.ColorFieldSwatch}
          disabled={props.disabled || props.readonly} value={pickerHex()}
          onInput={event => {
            const space = new Color(toCssFormat(untrack(color))).spaceId;
            const formatted = toShortFormat(new Color(event.currentTarget.value).to(space).toString());
            if (formatted) { committed = formatted; setInputValue(formatted); props.onValueChange?.(toCssFormat(formatted)); }
          }} />
        <div class={styles.ColorFieldSwatchBorder} />
      </div></TextField.Slot>
    </TextField.Root>
  </div>;
}
