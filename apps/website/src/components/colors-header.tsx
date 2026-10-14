import { Link } from '@wsagency/radix2solid-themes';
import { Header, type HeaderProps } from './header';
import { useSiteContext } from './site-context';

export function ColorsHeader(props: HeaderProps) {
  const site = useSiteContext();
  return <Header {...props} gitHubLink="https://github.com/wsagency/radix2solid">
    <Link size="2" color="gray" href="/colors/docs/overview/installation" highContrast={site.path.includes('/colors/docs')}>Documentation</Link>
    <Link size="2" color="gray" href="/colors/custom" highContrast={site.path.includes('/colors/custom')}>Custom palette</Link>
  </Header>;
}
