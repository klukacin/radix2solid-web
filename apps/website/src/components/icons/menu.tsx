import { CubeIcon, DownloadIcon, FigmaLogoIcon, GitHubLogoIcon } from "@wsagency/radix2solid-icons";
import { Flex, Link } from "@wsagency/radix2solid-themes";
export const Menu = () => {
  return <Flex m="6" justify="end" display={{
    initial: "none",
    md: "inline-flex"
  }} position="fixed" right="0" style={{
    "top": "var(--space-6)"
  }}>
			<Flex align="start" direction="column" gap="2" p="4" style={{
      "background-color": "var(--color-panel-solid)",
      "background-image": "linear-gradient(to top, var(--accent-a4), var(--accent-a4))",
      "border-radius": "var(--radius-1)",
      "box-shadow": "0 10px 40px -10px hsla(174, 100%, 30%, 0.05)",
      "user-select": "none"
    }}>
				<Flex align="center" gap="2" asChild>{target => target(Link, {
          "size": "2",
          "underline": "hover",
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
          "underline": "hover",
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
          "underline": "hover",
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
          "underline": "hover",
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
		</Flex>;
};
