import { Link } from '@radix-solid/themes';
import { Header, type HeaderProps } from './header';
import { useSiteContext } from './site-context';

export function PrimitivesHeader(props: HeaderProps) {
  const site = useSiteContext();
  return <Header {...props} gitHubLink="https://github.com/wsagency/radix2solid">
    <Link size="2" color="gray" href="/primitives/docs/overview/introduction" highContrast={site.path.includes('/primitives/docs')}>Documentation</Link>
    <Link size="2" color="gray" href="/primitives/case-studies" highContrast={site.path.includes('/primitives/case-studies')}>Case studies</Link>
  </Header>;
}
