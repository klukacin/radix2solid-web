import { AccessibleIcon, Avatar, Box, Flex, Grid, Section, Container, Heading, Card, Text, Link } from "@radix-solid/themes";
import { ArrowRightIcon } from "@radix-solid/icons";
import { CaseStudyLogo } from "./case-study-logo";
import { LogoLink } from "./logo-link";
import { MarketingCaption } from "./marketing-caption";
import { HiddenScroll } from "./hidden-scroll";
export const CaseStudiesSection = () => {
  return <Section size={{
    initial: "2",
    md: "4"
  }}>
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Box mb="5">
					<MarketingCaption mb="1">Case studies</MarketingCaption>
					<Heading as="h2" size="7" style={{
          "max-width": "500px"
        }}>
						Historical case studies from teams using the original Radix React project
					</Heading>
				</Box>

				<Grid columns={{
        sm: "2"
      }} gap="5" mb="6">
					<Card asChild size="3">{target => target("a", {
            "href": "/primitives/case-studies/nodejs",
            children: <>
							<Box mb="5" height="24px">
								<AccessibleIcon label="Node.js case study">{target => target(Box, {
                    "asChild": true,
                    "position": "relative",
                    "top": "-10px",
                    children: target => target(CaseStudyLogo, {
                      "variant": "Node.js"
                    })
                  })}</AccessibleIcon>
							</Box>
							<Text as="p" size="3" mb="4" style={{
                "text-indent": "-0.5em"
              }}>
								“Radix Primitives are crucial for the Node.js website and are a significant part of
								Node’s Web Design System. It allows our engineers to focus on what matters and
								create delightful experiences for the community.”
							</Text>
							<Flex align="center" gap="3">
								<Avatar size="3" fallback="R" radius="full" src="/marketing/avatar-claudio-wunder.jpg" aria-labelledby="person1" />
								<Text color="gray" size="3" id="person1">
									Claudio Wunder, Node.js Core Collaborator
								</Text>
							</Flex>
						</>
          })}</Card>
					<Card asChild size="3">{target => target("a", {
            "href": "/primitives/case-studies/vercel",
            children: <>
							<Box mb="5" height="24px">
								<AccessibleIcon label="Vercel case study">{target => target(CaseStudyLogo, {
                    "variant": "Vercel"
                  })}</AccessibleIcon>
							</Box>
							<Text as="p" size="3" mb="4" style={{
                "text-indent": "-0.5em"
              }}>
								“We’ve been able to focus on building solid user experiences on top of Radix
								Primitives. With UI components, there are just too many angles and rabbit holes to
								cover for product teams that wish to move quickly.”
							</Text>
							<Flex align="center" gap="3">
								<Avatar size="3" fallback="R" radius="full" src="/marketing/avatar-rauno-freiberg.jpg" aria-labelledby="person2" />
								<Text color="gray" size="3" id="person2">
									Rauno Freiberg, UI Engineer at Vercel
								</Text>
							</Flex>
						</>
          })}</Card>
				</Grid>

				<Link asChild size="2" color="gray" mb="4" style={{
        "display": "inline-flex",
        "align-items": "center",
        "gap": "var(--space-1)"
      }}>{target => target("a", {
          "href": "/primitives/case-studies",
          children: <>
						And dozens more companies
						<ArrowRightIcon style={{
              "margin-bottom": "-2px"
            }} />
					</>
        })}</Link>

				<HiddenScroll position="relative"
      // Add some padding so that logos aren't clipped when focused.
      py="3" my="-3"
      // Compensate Container margins
      mx={{
        initial: "-5",
        xs: "-6",
        sm: "-7",
        md: "-9"
      }} px={{
        initial: "5",
        xs: "6",
        sm: "7",
        md: "9"
      }}>
					<Grid columns="none" flow="column" align="center" justify="start" gap="6">
						<LogoLink asChild>{target => target("a", {
              "href": "/primitives/case-studies/basedash",
              children: <>
								<AccessibleIcon label="Basedash case study">{target => target(CaseStudyLogo, {
                    "variant": "Basedash",
                    "width": "135"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						<LogoLink style={{
            "margin-bottom": "-6px"
          }} asChild>{target => target("a", {
              "href": "/primitives/case-studies/basement-studio",
              children: <>
								<AccessibleIcon label="basement.studio case study">{target => target(CaseStudyLogo, {
                    "variant": "basement.studio",
                    "width": "120"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						<LogoLink style={{
            "margin-bottom": "-4px"
          }} asChild>{target => target("a", {
              "href": "/primitives/case-studies/codesandbox",
              children: <>
								<AccessibleIcon label="CodeSandbox case study">{target => target(CaseStudyLogo, {
                    "variant": "CodeSandbox",
                    "width": "160"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						<LogoLink asChild>{target => target("a", {
              "href": "/primitives/case-studies/linear",
              children: <>
								<AccessibleIcon label="Linear case study">{target => target(CaseStudyLogo, {
                    "variant": "Linear",
                    "width": "105"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						<LogoLink style={{
            "margin-bottom": "-3px"
          }} asChild>{target => target("a", {
              "href": "/primitives/case-studies/liveblocks",
              children: <>
								<AccessibleIcon label="Liveblocks case study">{target => target(CaseStudyLogo, {
                    "variant": "Liveblocks",
                    "width": "135"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						<LogoLink style={{
            "margin-bottom": "-2px"
          }} asChild>{target => target("a", {
              "href": "/primitives/case-studies/supabase",
              children: <>
								<AccessibleIcon label="Supabase case study">{target => target(CaseStudyLogo, {
                    "variant": "Supabase",
                    "width": "140"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						<LogoLink style={{
            "margin-top": "2px"
          }} asChild>{target => target("a", {
              "href": "/primitives/case-studies/university-of-amsterdam",
              children: <>
								<AccessibleIcon label="University of Amsterdam case study">{target => target(CaseStudyLogo, {
                    "variant": "University of Amsterdam",
                    "width": "152"
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>

						{/* Horizontal scroll spacer */}
						<div style={{
            "width": "1px",
            "height": "1px"
          }} />
					</Grid>
				</HiddenScroll>
			</Container>
		</Section>;
};
