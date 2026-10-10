
import { CubeIcon, DownloadIcon, FigmaLogoIcon, GitHubLogoIcon } from "@radix-solid/icons";
import { Box, Flex, Heading, Link, Separator, Text } from "@radix-solid/themes";
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
                "href": "https://github.com/klukacin/radix2solid",
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
							All icons are available as individual native Solid 2 components. Download the built package archive and install it locally:
						</Text>
						<Link href="/packages/radix-solid-icons-0.0.0-local.tgz" download size="2">Download native icons package</Link>

						<CodeBlock.Root mt="3">
							<CodeBlock.Content>
								<CodeBlock.Pre>
									<CodeBlock.Code language="bash">pnpm add ./radix-solid-icons-0.0.0-local.tgz</CodeBlock.Code>
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
import { FaceIcon, ImageIcon, SunIcon } from "@radix-solid/icons"

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
					</Box>

					<Box style={{
          "grid-column": "3 / 4"
        }}>
						<Heading as="h3" size="5">
							License
						</Heading>

						<Text as="p" size="2" mt="2">
							Licensed under the{" "}
							<Link size="2" href="https://github.com/klukacin/radix2solid/blob/main/packages/icons/LICENSE" highContrast color="gray">
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
