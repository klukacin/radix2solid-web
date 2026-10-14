import { Box, Flex, Heading, Link, Separator, Theme } from '@wsagency/radix2solid-themes';
import { ExternalLinkIcon } from '@wsagency/radix2solid-icons';
import { ExampleThemesDashboard } from '../components/example-themes-dashboard';

export default function ExamplePage() {
  return <Theme accentColor="indigo" grayColor="mauve" class="radix-themes-default-fonts">
    <Box p="9" minWidth="fit-content">
      <Box mx="auto" width="fit-content">
        <Flex align="center" direction="column">
          <Heading align="center" mb="2">Example layout built with Radix Themes</Heading>
          <Flex asChild align="center" gap="6px">{target => target(Link, {
            size: '2', color: 'gray', target: '_blank', rel: 'noreferrer',
            href: 'https://github.com/radix-ui/website/blob/main/components/example-themes-dashboard.tsx',
            children: <>Original React source <ExternalLinkIcon /></>,
          })}</Flex>
          <Separator size="2" my="8" />
        </Flex>
        <ExampleThemesDashboard />
      </Box>
    </Box>
  </Theme>;
}
