import { Box, Button, Dialog, ScrollArea } from '@radix-solid/themes';
import type { Element } from 'solid-js';
import { DocumentNavigation } from './navigation.js';
import { ThemesHeader } from './themes-header.js';
import { useSiteContext } from './site-context.js';

export function MarketingMobileMenu(props: { header?: Element; children?: Element; githubLink?: string }) {
  const site = useSiteContext();
  return <Dialog.Root open={site.mobileOpen} onOpenChange={site.setMobileOpen}>
    <Dialog.Content class="marketing-mobile-menu" aria-describedby={undefined}>
      <Dialog.Title class="sr-only">Navigation</Dialog.Title>
      {props.header ?? <ThemesHeader />}
      <ScrollArea><Box pt="4" px="3" pb="9">
        {props.children ?? <>
          <nav class="document-navigation" aria-label="Resources" onClick={event => { if ((event.target as globalThis.Element).closest('a')) site.setMobileOpen(false); }}>
            <a href="/">Homepage</a><a href="/themes/playground">Playground</a><a href="/blog">Blog</a>
          </nav>
          <DocumentNavigation path={site.path} onNavigate={() => site.setMobileOpen(false)} />
        </>}
        <a href={props.githubLink ?? 'https://github.com/wsagency/radix2solid'}>Native source on GitHub</a>
        <Dialog.Close>{target => target(Button, { color: 'gray', variant: 'soft', 'aria-label': 'Close navigation', children: 'Close' })}</Dialog.Close>
      </Box></ScrollArea>
    </Dialog.Content>
  </Dialog.Root>;
}
