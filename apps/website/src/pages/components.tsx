import { Card, Grid, Heading, Text } from '@wsagency/radix2solid-themes';
import { routes } from '../routes.js';
import { useSiteContext } from '../components/site-context.js';

export default function Components() {
  const site = useSiteContext();
  const pages = Object.entries(routes).filter(([path]) => path.startsWith(`${site.path}/`)).sort(([, a], [, b]) => a.frontmatter.metaTitle.localeCompare(b.frontmatter.metaTitle));
  return <><Heading as="h1" size="8" mb="3">Components</Heading><Text as="p" size="4" color="gray" mb="6">Explore the native Solid components and their documentation.</Text><Grid columns={{ initial: '1', sm: '2' }} gap="4">{pages.map(([path, page]) => <Card asChild>{target => target('a', { href: path, children: <><Heading as="h2" size="4" mb="2">{page.frontmatter.metaTitle}</Heading><Text as="p" size="2" color="gray">{page.frontmatter.metaDescription}</Text></> })}</Card>)}</Grid></>;
}
