import { Box, Flex, Heading, Link, Separator, Theme } from '@radix-solid/themes';
import { ExternalLinkIcon } from '@radix-solid/icons';
import { ExampleThemesEcommerce } from '../components/example-themes-ecommerce';

export default function ExamplePage() {
  return <Theme accentColor="gray" grayColor="gray" class="radix-themes-default-fonts">
    <Box p="9" minWidth="fit-content">
      <Box mx="auto" width="fit-content">
        <Flex align="center" direction="column">
          <Heading align="center" mb="2">Example layout built with Radix Themes</Heading>
          <Flex asChild align="center" gap="6px">{target => target(Link, {
            size: '2', color: 'gray', target: '_blank', rel: 'noreferrer',
            href: 'https://github.com/radix-ui/website/blob/main/components/example-themes-ecommerce.tsx',
            children: <>Original React source <ExternalLinkIcon /></>,
          })}</Flex>
          <Separator size="2" my="8" />
        </Flex>
        <ExampleThemesEcommerce />
      </Box>
    </Box>
  </Theme>;
}
