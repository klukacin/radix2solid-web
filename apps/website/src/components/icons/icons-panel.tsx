
import { CubeIcon, DownloadIcon, FigmaLogoIcon, GitHubLogoIcon } from "@wsagency/radix2solid-icons";
import { Box, Code, Flex, Heading, Link, Separator, Text } from "@wsagency/radix2solid-themes";
import { CopyToastProvider } from "./copy-toast";
import { MainContent } from "./main-content";
import { CodeBlock } from "../code-block";
import styles from "./icons-panel.module.css";
export const IconsPanel = () => {
  return <CopyToastProvider>
			<Box style={{
      "border-radius": "var(--radius-4)",
      "min-height": "900px",
      "background": "var(--color-background)",
      "position": "relative"
    }}>
				<Box position="absolute" inset="0" style={{
        "pointer-events": "none",
        "border-radius": "inherit",
        "box-shadow": "var(--shadow-5)"
      }} />
				<MainContent />

				<Separator size="4" />

				<Box p={{
        initial: "5",
        sm: "6"
      }} class={styles.IconsPanelMainSection}>
					<Box mb="5" style={{
          "grid-column": "3 / 4"
        }}>
						<Heading as="h3" size="5">
							Assets
						</Heading>

						<Flex direction="column" gap="2" mt="3">
							<Flex align="center" gap="2" asChild>{target => target(Link, {
                "size": "2",
                "href": "https://www.figma.com/community/file/1510053249065427020/radix-icons",
                "target": "_blank",
                "highContrast": true,
                "color": "gray",
                children: <>
									<FigmaLogoIcon />
									Open in Figma
								</>
              })}</Flex>

							<Flex align="center" gap="2" asChild>{target => target(Link, {
                "size": "2",
                "href": "/icons/radix-icons.zip",
                "target": "_blank",
                "highContrast": true,
                "color": "gray",
                children: <>
									<DownloadIcon />
									Download SVG
								</>
              })}</Flex>
							<Flex align="center" gap="2" asChild>{target => target(Link, {
                "size": "2",
                "href": "/icons#installation",
                "target": "_blank",
                "highContrast": true,
                "color": "gray",
                children: <>
									<CubeIcon />
									Installation
								</>
              })}</Flex>

							<Flex align="center" gap="2" asChild>{target => target(Link, {
                "size": "2",
                "href": "https://github.com/wsagency/radix2solid",
                "target": "_blank",
                "highContrast": true,
                "color": "gray",
                children: <>
									<GitHubLogoIcon />
									View on GitHub
								</>
              })}</Flex>
						</Flex>
					</Box>

					<Box mb={{
          initial: "5",
          sm: "0"
        }} class={styles.IconsPanelSectionContent} id="installation">
						<Heading as="h3" size="5">
							Solid components
						</Heading>

						<Text as="p" size="3" mt="3">
							All icons are available as individual native Solid 2 components. Install the published release candidate from <Link href="https://www.npmjs.com/package/@wsagency/radix2solid-icons">npm</Link>:
						</Text>
						<Link href="/packages/wsagency-radix2solid-icons-0.1.0-rc.2.tgz" download size="2">Download native icons package</Link>
						<Text as="p" size="2">For a local archive installation, download the package and run <Code>pnpm add ./wsagency-radix2solid-icons-0.1.0-rc.2.tgz</Code>.</Text>

						<CodeBlock.Root mt="3">
							<CodeBlock.Content>
								<CodeBlock.Pre>
									<CodeBlock.Code language="bash">pnpm add -E @wsagency/radix2solid-icons@0.1.0-rc.2</CodeBlock.Code>
								</CodeBlock.Pre>
								<CodeBlock.CopyButton />
							</CodeBlock.Content>
						</CodeBlock.Root>

						<Text as="p" size="3" mt="4">
							Import the icons into your Solid 2 project:
						</Text>

						<CodeBlock.Root mt="3">
							<CodeBlock.Content>
								<CodeBlock.Pre>
									<CodeBlock.Code language="jsx">
										{`
import { FaceIcon, ImageIcon, SunIcon } from "@wsagency/radix2solid-icons"

function MyComponent () {
	return (
		<div>
			<FaceIcon />
			<SunIcon />
			<ImageIcon />
		</div>
	)
}
`.trim()}
									</CodeBlock.Code>
								</CodeBlock.Pre>
							</CodeBlock.Content>
						</CodeBlock.Root>

						<Text as="p" size="2" mt="4" color="gray">
							Bundle cost: the first <Code size="2">CheckIcon</Code> adds 22,379 B (7,966 B gzip) to an empty Solid app, most of it the Solid web runtime, and 1,310 B (631 B gzip) to an app that already renders a Themes <Code size="2">Button</Code>. Root and per-icon imports cost the same. Measured with Vite 8.3.3 client builds, minified, zlib gzip level 9, on Node 22.12 with Solid 2.0.0-rc.13 and package release 0.1.0-rc.1. Don’t add Themes just to use icons.
						</Text>
						<Text as="p" size="2" mt="2" color="gray">
							Custom icons are your own SVG or Solid component; there is no icon factory or extension package. Folder and brand icons stay in your app.
						</Text>
					</Box>

					<Box style={{
          "grid-column": "3 / 4"
        }}>
						<Heading as="h3" size="5">
							License
						</Heading>

						<Text as="p" size="2" mt="2">
							Licensed under the{" "}
							<Link size="2" href="https://github.com/wsagency/radix2solid/blob/main/packages/icons/LICENSE" highContrast color="gray">
								MIT License
							</Link>
							.
							<br />
							Native fork © 2026 Radix2Solid contributors; original icons © 2022–present WorkOS.
						</Text>
					</Box>
				</Box>
			</Box>
		</CopyToastProvider>;
};
