import { Box } from '@wsagency/radix2solid-themes';
import { MarketingMobileMenu } from './marketing-mobile-menu';
import { PrimitivesHeader } from './primitives-header';
import { DocumentNavigation } from './navigation';
import { SearchTrigger } from './search';
import { useSiteContext } from './site-context';

export function PrimitivesMobileMenu() {
  const site = useSiteContext();
  return <MarketingMobileMenu header={<PrimitivesHeader />} githubLink="https://github.com/wsagency/radix2solid">
    <Box mb="4"><SearchTrigger /></Box>
    <nav class="document-navigation" aria-label="Resources" onClick={event => { if ((event.target as Element).closest('a')) site.setMobileOpen(false); }}>
      <a href="/primitives">Homepage</a><a href="/primitives/case-studies">Case studies</a><a href="/blog">Blog</a>
    </nav>
    <DocumentNavigation path="/primitives" onNavigate={() => site.setMobileOpen(false)} />
  </MarketingMobileMenu>;
}
