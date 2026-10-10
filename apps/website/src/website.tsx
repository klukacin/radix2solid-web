import { Avatar, Box, Flex, Heading, Text, Theme } from '@radix-solid/themes';
import { routes, type DocumentModule } from './routes.js';
import { components } from './components/mdx-components.js';
import { DocumentNavigation, DocumentReferences, DocsPagination, MobileNavigation, QuickNav } from './components/navigation.js';
import { CaseStudyLogo, type CaseStudyLogoVariant } from './components/marketing/case-study-logo.js';
import { Search, SearchTrigger } from './components/search.js';
import { SiteProvider, ThemePreferenceSync } from './components/site-context.js';
import { ThemeToggle } from './components/theme-toggle.js';
import { GitHubLogoIcon } from '@radix-solid/icons';
import { Radix2SolidLogo } from './components/radix-logo.js';
import './styles.css';
import '@radix-solid/themes/styles.css';
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
      <header class="site-header"><a href="/" aria-label="Radix2Solid homepage"><Radix2SolidLogo /></a><nav class="product-navigation" aria-label="Products"><a href="/">Themes</a><a href="/primitives">Primitives</a><a href="/icons">Icons</a><a href="/colors">Colors</a><a href="/blog">Blog</a></nav><a href="https://github.com/klukacin/radix2solid" aria-label="View GitHub" target="_blank" rel="noopener noreferrer"><GitHubLogoIcon width="16" height="16" /></a><SearchTrigger /><ThemeToggle /><MobileNavigation path={props.path} /></header>
      <div class={`document-layout${caseStudy ? ' case-study-layout' : ''}`}><aside class="desktop-navigation" aria-label={props.path.startsWith('/blog') ? 'Blog' : caseStudy ? 'Case studies' : 'Documentation'}><DocumentNavigation path={props.path} /></aside><main class="document" data-search-page-scope>
        {typeof metadata.publishedAt === 'string' && <Text as="p" size="2" color="gray" mb="3"><time>{metadata.publishedAt}</time></Text>}
        {caseStudy && <Text as="p" size="2" color="gray" mb="1">Case study</Text>}
        <Document components={components} />
        {caseStudy && <Flex class="case-study-author" align="center" gap="3" mt="8"><Avatar size="5" src={metadata.authorAvatarUrl as string} fallback={(metadata.author as string).slice(0, 1)} alt="" radius="full" /><Box><Text as="p" weight="bold">{metadata.author as string}</Text><Text as="p">{metadata.authorPosition as string}</Text></Box></Flex>}
        {(documentation || props.path.startsWith('/blog/')) && <DocumentReferences path={props.path} />}{documentation && <DocsPagination path={props.path} />}
        {caseStudy && <nav class="case-study-pagination" aria-label="Case study pagination" data-search-exclude data-md-exclude><a href={nextCase} rel="next">Next case study: {routes[nextCase].frontmatter.metaTitle}</a></nav>}
      </main>{caseStudy ? <aside class="case-study-about" aria-labelledby="company-about-heading"><a href={companyUrl} target="_blank" rel="noopener noreferrer" aria-label={`${metadata.metaTitle} homepage`}><CaseStudyLogo variant={metadata.companyLogoVariant as CaseStudyLogoVariant} aria-hidden="true" /></a><Heading as="h2" id="company-about-heading" size="4" mt="5" mb="3">About {metadata.metaTitle}</Heading><Text as="p" size="2" mb="4">{metadata.companyAbout as string}</Text><Heading as="h3" size="2" mb="2">Founded</Heading><Text as="p" size="2" color="gray" mb="4">{metadata.companyFounded as string}</Text><a href={companyUrl} target="_blank" rel="noopener noreferrer">{metadata.companyUrl as string}</a></aside> : <QuickNav />}</div>
    </>}
    <footer>Radix2Solid is an unofficial native Solid 2 fork, not a WorkOS product. Original documentation and designs © WorkOS, MIT licensed. <a href="/NOTICE.txt">Attribution and asset notices</a>.</footer></Search>
  </Theme></SiteProvider>;
}
