import { Avatar, Box, Flex, Heading, Text, Theme } from '@wsagency/radix2solid-themes';
import { routes, type DocumentModule } from './routes.js';
import { components } from './components/mdx-components.js';
import { DocumentNavigation, DocumentReferences, DocsPagination, MobileNavigation, QuickNav } from './components/navigation.js';
import { CaseStudyLogo, type CaseStudyLogoVariant } from './components/marketing/case-study-logo.js';
import { Search, SearchTrigger } from './components/search.js';
import { SiteProvider, ThemePreferenceSync } from './components/site-context.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { GitHubLogoIcon } from '@wsagency/radix2solid-icons';
import { Radix2SolidLogo } from './components/radix-logo.js';
import './styles.css';
import '@wsagency/radix2solid-themes/styles.css';
import './marketing.css';

export function Website(props: { path: string; route?: DocumentModule }) {
  if (!props.route) return <main><h1>Page not found</h1><a href="/">Home</a></main>;
  const Document = props.route.default;
  const metadata = props.route.frontmatter;
  const documentation = props.path.includes('/docs/');
  const marketing = metadata.kind === 'page' && !documentation;
  const caseStudy = props.path.startsWith('/primitives/case-studies/');
  const cases = caseStudy ? Object.keys(routes).filter(path => path.startsWith('/primitives/case-studies/')).sort() : [];
  const nextCase = cases[(cases.indexOf(props.path) + 1) % cases.length];
  const companyUrl = caseStudy ? `https://${metadata.companyUrl as string}` : undefined;
  return <SiteProvider path={props.path}><Theme accentColor="indigo" radius="medium" class={marketing ? 'radix-themes-custom-fonts' : undefined}>
    <Search><ThemePreferenceSync />
    {marketing ? <main data-search-page-scope><Document components={components} /></main> : <>
      <header class="site-header"><a href="/" aria-label="Radix2Solid homepage"><Radix2SolidLogo /></a><nav class="product-navigation" aria-label="Products"><a href="/">Themes</a><a href="/primitives">Primitives</a><a href="/icons">Icons</a><a href="/charts">Charts</a><a href="/colors">Colors</a><a href="/blog">Blog</a></nav><a href="https://github.com/wsagency/radix2solid" aria-label="View GitHub" target="_blank" rel="noopener noreferrer"><GitHubLogoIcon width="16" height="16" /></a><SearchTrigger /><ThemeToggle /><MobileNavigation path={props.path} /></header>
      <div class={`document-layout${caseStudy ? ' case-study-layout' : ''}`}><aside class="desktop-navigation" aria-label={props.path.startsWith('/blog') ? 'Blog' : caseStudy ? 'Case studies' : 'Documentation'}><DocumentNavigation path={props.path} /></aside><main class="document" data-search-page-scope>
        {typeof metadata.publishedAt === 'string' && <Text as="p" size="2" color="gray" mb="3"><time>{metadata.publishedAt}</time></Text>}
        {caseStudy && <Text as="p" size="2" color="gray" mb="1">Case study</Text>}
        <Document components={components} />
        {caseStudy && <Flex class="case-study-author" align="center" gap="3" mt="8"><Avatar size="5" src={metadata.authorAvatarUrl as string} fallback={(metadata.author as string).slice(0, 1)} alt="" radius="full" /><Box><Text as="p" weight="bold">{metadata.author as string}</Text><Text as="p">{metadata.authorPosition as string}</Text></Box></Flex>}
        {(documentation || props.path.startsWith('/blog/')) && <DocumentReferences path={props.path} />}{documentation && <DocsPagination path={props.path} />}
        {caseStudy && <nav class="case-study-pagination" aria-label="Case study pagination" data-search-exclude data-md-exclude><a href={nextCase} rel="next">Next case study: {routes[nextCase].frontmatter.metaTitle}</a></nav>}
      </main>{caseStudy ? <aside class="case-study-about" aria-labelledby="company-about-heading"><a href={companyUrl} target="_blank" rel="noopener noreferrer" aria-label={`${metadata.metaTitle} homepage`}><CaseStudyLogo variant={metadata.companyLogoVariant as CaseStudyLogoVariant} aria-hidden="true" /></a><Heading as="h2" id="company-about-heading" size="4" mt="5" mb="3">About {metadata.metaTitle}</Heading><Text as="p" size="2" mb="4">{metadata.companyAbout as string}</Text><Heading as="h3" size="2" mb="2">Founded</Heading><Text as="p" size="2" color="gray" mb="4">{metadata.companyFounded as string}</Text><a href={companyUrl} target="_blank" rel="noopener noreferrer">{metadata.companyUrl as string}</a></aside> : <QuickNav />}</div>
    </>}
    <footer class="site-footer">
      <Box class="site-footer-inner">
        <Text as="p" size="2">Radix2Solid is an unofficial native Solid 2 fork, not a WorkOS product. Original documentation and designs © WorkOS, MIT licensed. Charts derive from solid-recharts © Thomas Guehenneux and Recharts © recharts (MIT); neither project endorses this fork. Charts use D3 © Mike Bostock (ISC). Built with Solid © Ryan Carniato, Floating UI and other open-source packages (MIT, BSD-2-Clause). <a href="/NOTICE.txt">Attribution and asset notices</a>.</Text>
        <Flex class="site-footer-credit-row" gap="5" mt="4">
          <a class="agency-credit" href="https://ws.agency" aria-label="Made with love by WS Agency">
            <span>Made with <span class="sr-only">love</span></span>
            <span class="agency-credit-symbols">
              <svg class="agency-heart" width="20.48" height="20" aria-hidden="true" viewBox="0.67 0.17 22.66 22.13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M12 21C10 19 2 13 2 7a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 6-8 12-10 14Z" /></svg>
              <span>by</span>
              <img class="agency-mark agency-mark-light" src="/marketing/ws-agency-sign-color.svg" width="406.48" height="168.18" alt="" />
              <img class="agency-mark agency-mark-dark" src="/marketing/ws-agency-sign-white.svg" width="406.48" height="168.18" alt="" />
            </span>
          </a>
          <Text as="p" size="2">Created by <a href="https://github.com/klukacin">Kristijan Lukačin (@klukacin)</a> for WS Agency. We love open source, enterprise development and AI. Have a project in mind? <a href="https://ws.agency/contact">Let’s build it together.</a></Text>
        </Flex>
      </Box>
    </footer></Search>
  </Theme></SiteProvider>;
}
