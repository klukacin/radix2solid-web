import { Box } from '@radix-solid/themes';
import { MarketingMobileMenu } from './marketing-mobile-menu';
import { ColorsHeader } from './colors-header';
import { DocumentNavigation } from './navigation';
import { SearchTrigger } from './search';
import { useSiteContext } from './site-context';

export function ColorsMobileMenu() {
  const site = useSiteContext();
  return <MarketingMobileMenu header={<ColorsHeader />} githubLink="https://github.com/klukacin/radix2solid">
    <Box mb="4"><SearchTrigger /></Box>
    <nav class="document-navigation" aria-label="Resources" onClick={event => { if ((event.target as Element).closest('a')) site.setMobileOpen(false); }}>
      <a href="/colors">Homepage</a><a href="/colors/custom">Custom palette</a><a href="/blog">Blog</a>
    </nav>
    <DocumentNavigation path="/colors" onNavigate={() => site.setMobileOpen(false)} />
  </MarketingMobileMenu>;
}
