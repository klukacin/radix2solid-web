import { Container, Theme } from '@wsagency/radix2solid-themes';
import { CubeIcon, DownloadIcon, FigmaLogoIcon, GitHubLogoIcon } from '@wsagency/radix2solid-icons';
import { IconsHeader } from '../components/icons-header';
import { MarketingMobileMenu } from '../components/marketing-mobile-menu';
import { IconsHero } from '../components/icons/icons-hero';
import { IconsPanel } from '../components/icons/icons-panel';
import { Menu } from '../components/icons/menu';
import { useSiteContext } from '../components/site-context';

const resources = [
  { label: 'Figma', href: 'https://www.figma.com/community/file/1510053249065427020/radix-icons', Icon: FigmaLogoIcon },
  { label: 'SVG', href: '/icons/radix-icons.zip', Icon: DownloadIcon },
  { label: 'Installation', href: '/icons#installation', Icon: CubeIcon },
  { label: 'GitHub', href: 'https://github.com/radix-ui/icons', Icon: GitHubLogoIcon },
];
export default function IconsPage() {
  const site = useSiteContext();
  return <Theme accentColor="teal" grayColor="slate" class="radix-themes-custom-fonts">
    <MarketingMobileMenu header={<IconsHeader />} githubLink="https://github.com/radix-ui/icons">
      <nav class="document-navigation" aria-label="Resources" onClick={event => { if ((event.target as Element).closest('a')) site.setMobileOpen(false); }}>
        <a href="/icons">Homepage</a><a href="/blog">Blog</a>
        <h2>Resources</h2>
        <ul>{resources.map(resource => <li><a href={resource.href}><resource.Icon /> {resource.label}</a></li>)}</ul>
      </nav>
    </MarketingMobileMenu>
    <IconsHeader ghost />
    <IconsHero />
    <Menu />
    <Container mx={{ initial: '5', xs: '6', sm: '7', md: '9' }} pb="9"><IconsPanel /></Container>
  </Theme>;
}
