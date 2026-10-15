import { createMemo } from 'solid-js';
import * as Icons from '@wsagency/radix2solid-icons';
import { FolderIcon, FolderOpenIcon } from '@wsagency/radix2solid-icons-extra';
import { Button, Flex, Grid, Text } from '@wsagency/radix2solid-themes';
import { useCopyToast } from './copy-toast';

function iconLabel(key: string) {
  switch (key) {
    case 'LinkedInLogoIcon': return 'LinkedIn Logo';
    case 'GitHubLogoIcon': return 'GitHub Logo';
    case 'IconJarLogoIcon': return 'IconJar Logo';
    case 'CodeSandboxLogoIcon': return 'CodeSandbox Logo';
    case 'CounterClockwiseClockIcon': return 'Counter-Clockwise Clock';
    case 'RotateCounterClockwiseIcon': return 'Rotate Counter-Clockwise';
    default: return key.replace(/Icon$/, '').replace(/(.)([0-9A-Z])/g, '$1 $2');
  }
}
const icons = Object.entries(Icons).filter(([key, value]) => key.endsWith('Icon') && typeof value === 'function')
  .map(([key, component]) => ({ name: iconLabel(key), Component: component as typeof Icons.FaceIcon }));
const extraIcons = [{ name: 'Folder', Component: FolderIcon }, { name: 'Folder Open', Component: FolderOpenIcon }];

export function SearchResults(props: { value: string }) {
  const { copyIcon } = useCopyToast();
  const pattern = createMemo(() => {
    const literal = props.value.trim().replace(/\s/g, ' ').replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
    return new RegExp(`\\b${literal}`, 'i');
  });
  const matching = createMemo(() => icons.filter(icon => pattern().test(icon.name)));
  const matchingExtra = createMemo(() => extraIcons.filter(icon => pattern().test(icon.name)));
  return <>
    {props.value && matching().length > 0 && <Grid flow={{ initial: 'row', sm: 'column' }} gapX="6" gapY="5"
      rows={{ sm: `repeat(${Math.max(Math.ceil(matching().length / 2), 3)}, auto)`, md: `repeat(${Math.max(Math.ceil(matching().length / 4), 3)}, auto)` }}
      columns={{ initial: '1', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} py={{ initial: '3', sm: '6' }} px={{ initial: '4', sm: '7' }}>
      {matching().map(icon => <Button style={{ 'justify-content': 'flex-start' }} variant="ghost" highContrast size="3" onClick={event => copyIcon(event.currentTarget)}><icon.Component />{icon.name}</Button>)}
    </Grid>}
    {props.value && matchingExtra().length > 0 && <section aria-label="Extra icon results">
      <Text as="p" weight="bold" mx="4">Extra icons · separate optional package</Text>
      <Flex gap="4" px="4" py="4">
        {matchingExtra().map(icon => <Button variant="ghost" highContrast size="3" onClick={event => copyIcon(event.currentTarget)}><icon.Component />{icon.name}</Button>)}
      </Flex>
    </section>}
    {!matching().length && !matchingExtra().length && <Flex role="status" align="center" justify="center" py="6" px="6" style={{ 'min-height': '300px' }}>
      <Text size="2" style={{ 'text-align': 'center' }}>No icons for <Text weight="bold">{props.value}</Text></Text>
    </Flex>}
  </>;
}
