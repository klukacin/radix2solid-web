import { createMemo } from 'solid-js';
import type { JSX } from '@solidjs/web';
import * as metadata from '@radix-solid/themes/props';
import { Code, Link } from '@radix-solid/themes';
import { PropsTable } from './mdx-components.js';

type Definition = { type: string; values?: readonly string[]; default?: unknown; required?: boolean; responsive?: boolean };
const definitions = { ...metadata,
  flexChildrenPropDefs: Object.fromEntries(['flexBasis', 'flexShrink', 'flexGrow'].map(name => [name, metadata.layoutPropDefs[name as keyof typeof metadata.layoutPropDefs]])),
  gridChildrenPropDefs: Object.fromEntries(['gridArea', 'gridColumn', 'gridColumnStart', 'gridColumnEnd', 'gridRow', 'gridRowStart', 'gridRowEnd'].map(name => [name, metadata.layoutPropDefs[name as keyof typeof metadata.layoutPropDefs]])),
  positionPropDefs: Object.fromEntries(['position', 'inset', 'top', 'right', 'bottom', 'left'].map(name => [name, metadata.layoutPropDefs[name as keyof typeof metadata.layoutPropDefs]]))
} as Record<string, unknown>;
const values = (input?: readonly string[] | string) => Array.isArray(input) ? input.filter(Boolean).map(value => JSON.stringify(value)).join(' | ') : input === undefined ? '' : JSON.stringify(input);
const responsive = (type: string, enabled?: boolean) => enabled && type ? `Responsive<${type}>` : type;
const guide = (path: string, text: string) => <Link href={`/themes/docs/theme/${path}`}>{text}</Link>;
const textAlign = () => <>Sets the CSS <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-align">text-align</Link> property.</>;
const textWrap = () => <>Controls the wrapping behavior of the text. See the corresponding <Link href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap">text-wrap</Link> values for details.</>;
const common: Record<string, JSX.Element | (() => JSX.Element)> = {
  variant: () => <>The visual variant to apply, see {guide('overview#variants', 'theme overview')} for more details.</>,
  color: () => <>Overrides the accent color inherited from the Theme. See the {guide('color', 'color guide')} for more details.</>,
  highContrast: 'Uses a higher contrast color for the component.',
  radius: () => <>Overrides the radius inherited from the theme. See the {guide('radius', 'radius guide')} for more details.</>,
  as: () => <>Shorthand for changing the default rendered element into a semantically appropriate alternative. Cannot be used in combination with <Code>asChild</Code>.</>,
  asChild: () => <>Render one explicit target with merged props and behavior, not a cloned child. Read our <Link href="/primitives/docs/guides/composition">Composition</Link> guide for details.</>,
  shortcut: 'Optional shortcut command displayed next to the item text.',
  trim: 'Trims the leading whitespace from the start or end of the text.',
  truncate: () => <>Truncates text with an ellipsis. Be aware of <Link href="https://css-tricks.com/flexbox-truncated-text/">common pitfalls</Link> in flex layouts.</>
};
const unique: Record<string, Record<string, JSX.Element | (() => JSX.Element)>> = {
  avatarPropDefs: { fallback: 'The fallback element to render when an image is not available.' },
  blockquotePropDefs: { wrap: textWrap }, codePropDefs: { wrap: textWrap }, emPropDefs: { wrap: textWrap },
  headingPropDefs: { align: textAlign, wrap: textWrap }, linkPropDefs: { wrap: textWrap, underline: 'Sets the visibility of the underline affordance.' },
  quotePropDefs: { wrap: textWrap }, scrollAreaPropDefs: { scrollbars: 'Controls the scrollable axes.' }, strongPropDefs: { wrap: textWrap },
  spinnerPropDefs: { loading: 'Toggles whether to hide the children and display the spinner.' }, textPropDefs: { align: textAlign, wrap: textWrap },
  themePropDefs: {
    appearance: () => <>The color scheme of the theme (typically referred to as light and dark mode). See the {guide('dark-mode', 'dark mode guide')} for details.</>,
    accentColor: () => <>The dominant color of the theme, see the {guide('color', 'color guide')} for details.</>,
    grayColor: () => <>The grayscale of the theme, see the {guide('color', 'color guide')} for details.</>,
    hasBackground: 'Whether to apply the theme background color to the theme node.',
    scaling: () => <>The linear scaling applied to the theme. See the {guide('spacing#scaling', 'scaling guide')} for details.</>
  }, tooltipPropDefs: { content: 'The content associated with the tooltip.' }
};

export function ThemesPropsTable(props: { defs: string }) {
  const data = createMemo(() => {
    const definition = definitions[props.defs];
    if (!definition || typeof definition !== 'object') throw new Error(`Missing native prop definitions: ${props.defs}`);
    return Object.entries(definition as Record<string, Definition>).map(([name, item]) => {
      let type = values(item.values);
      if (type && item.type === 'enum | string') type = `Union<string, ${type}>`;
      type = responsive(type, item.responsive);
      const simple = !item.values || type.length > 60 || item.type === 'enum | string';
      return { name, required: item.required, typeSimple: simple ? responsive(item.type, item.responsive) : type,
        type: simple ? type : undefined, default: typeof item.default === 'boolean' ? String(item.default) : typeof item.default === 'string' ? values(item.default) : undefined,
        description: unique[props.defs]?.[name] ?? common[name] };
    });
  });
  return <PropsTable data={data()} propHeaderFixedWidth={false} />;
}
