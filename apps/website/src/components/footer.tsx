import { useSiteContext } from './site-context';

import { Box, Grid, Text, Flex, Link, Heading, AccessibleIcon } from "@wsagency/radix2solid-themes";
import { Radix2SolidLogo } from "./radix-logo";
import { BoxLink } from "./box-link";
import { ArrowTopRightIcon } from "@wsagency/radix2solid-icons";
import styles from "./footer.module.css";
export const Footer = () => {
  const pathname = useSiteContext().path;
  const isColors = pathname?.includes("/colors") || false;
  return <Grid asChild pb="9" gapX="7" gapY="3" class={styles.Footer}>{target => target("footer", {
      children: <>
				<Flex align="start" direction="column" class={styles.RadixLogo} mb="5">
					<BoxLink asChild>{target => target("a", {
              "href": "/",
              children: <>
							<AccessibleIcon label="Radix2Solid homepage">{target => target(Radix2SolidLogo, {})}</AccessibleIcon>
						</>
            })}</BoxLink>
					<Box pr="8" mt="5">
						<Heading as="h6" size="2" style={{
              "line-height": "20px",
              "color": "var(--gray-10)",
              "font-weight": "inherit"
            }}>
							Unofficial native Solid 2 fork. Original Radix design by{" "}
							<Link color="gray" href="https://workos.com">
								WorkOS
							</Link>
							.
						</Heading>
					</Box>
				</Flex>
				<Box>
					<Heading as="h6" size="3">
						Products
					</Heading>
					<ul>
						<li>
							<Text as="p" size="2" mt="3">
								<Link color="gray" asChild>{target => target("a", {
                    "href": "/",
                    children: <>Themes</>
                  })}</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link color="gray" asChild>{target => target("a", {
                    "href": "/primitives",
                    children: <>Primitives</>
                  })}</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link color="gray" asChild>{target => target("a", {
                    "href": "/colors",
                    children: <>Colors</>
                  })}</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link color="gray" asChild>{target => target("a", {
                    "href": "/icons",
                    children: <>Icons</>
                  })}</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link color="gray" asChild>{target => target("a", {
                    "href": "/charts",
                    children: <>Charts</>
                  })}</Link>
							</Text>
						</li>
					</ul>
				</Box>
				{isColors === false && <Box>
						<Heading as="h6" size="3">
							Docs
						</Heading>
						<ul>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/primitives/docs/overview/introduction",
                    children: <>Introduction</>
                  })}</Link>
								</Text>
							</li>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/primitives/docs/guides/styling",
                    children: <>Styling</>
                  })}</Link>
								</Text>
							</li>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/primitives/docs/overview/accessibility",
                    children: <>
											Accessibility
										</>
                  })}</Link>
								</Text>
							</li>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/primitives/docs/overview/releases",
                    children: <>Releases</>
                  })}</Link>
								</Text>
							</li>
						</ul>
					</Box>}
				{isColors && <Box>
						<Heading as="h6" size="3">
							Docs
						</Heading>
						<ul>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/colors/docs/overview/installation",
                    children: <>Installation</>
                  })}</Link>
								</Text>
							</li>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/colors/docs/palette-composition/scales",
                    children: <>Scales</>
                  })}</Link>
								</Text>
							</li>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/colors/docs/palette-composition/composing-a-palette",
                    children: <>
											Palette composition
										</>
                  })}</Link>
								</Text>
							</li>
							<li>
								<Text as="p" size="2" mt="3">
									<Link color="gray" asChild>{target => target("a", {
                    "href": "/colors/docs/palette-composition/understanding-the-scale",
                    children: <>
											Understanding the scale
										</>
                  })}</Link>
								</Text>
							</li>
						</ul>
					</Box>}
				<Box>
					<Heading as="h6" size="3">
						Original Radix community
					</Heading>
					<ul>
						<li>
							<Text as="p" size="2" mt="3">
								<Link href="https://github.com/radix-ui" color="gray" target="_blank" style={{
                  "display": "inline-flex",
                  "align-items": "center"
                }}>
									GitHub
									<Flex asChild ml="2" style={{
                    "color": "var(--gray-8)"
                  }}>{target => target(ArrowTopRightIcon, {})}</Flex>
								</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link href="https://bsky.app/profile/radix-ui.com" color="gray" target="_blank" style={{
                  "display": "inline-flex",
                  "align-items": "center"
                }}>
									Bluesky
									<Flex asChild ml="2" style={{
                    "color": "var(--gray-8)"
                  }}>{target => target(ArrowTopRightIcon, {})}</Flex>
								</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link href="https://twitter.com/radix_ui" color="gray" target="_blank" style={{
                  "display": "inline-flex",
                  "align-items": "center"
                }}>
									Twitter
									<Flex asChild ml="2" style={{
                    "color": "var(--gray-8)"
                  }}>{target => target(ArrowTopRightIcon, {})}</Flex>
								</Link>
							</Text>
						</li>
						<li>
							<Text as="p" size="2" mt="3">
								<Link href="https://discord.com/invite/7Xb99uG" color="gray" target="_blank" style={{
                  "display": "inline-flex",
                  "align-items": "center"
                }}>
									Discord
									<Flex asChild ml="2" style={{
                    "color": "var(--gray-8)"
                  }}>{target => target(ArrowTopRightIcon, {})}</Flex>
								</Link>
							</Text>
						</li>
					</ul>
				</Box>
			</>
    })}</Grid>;
};
