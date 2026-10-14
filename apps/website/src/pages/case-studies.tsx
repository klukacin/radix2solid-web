import { Footer } from "../components/footer";
import { PrimitivesHeader } from "../components/primitives-header";
import { PrimitivesMobileMenu } from "../components/primitives-mobile-menu";
import { CaseStudyLogo } from "../components/marketing/case-study-logo";
import { LogoLink } from "../components/marketing/logo-link";
import { AccessibleIcon } from "@wsagency/radix2solid-themes";
import { ArrowTopRightIcon } from "@wsagency/radix2solid-icons";
import { Box, Container, Flex, Grid, Heading, Link, Section, Separator, Text } from "@wsagency/radix2solid-themes";
export default function CaseStudy() {
  return <>
			<PrimitivesMobileMenu />
			<PrimitivesHeader />
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Section size={{
        initial: "2",
        md: "4"
      }}>
					<Flex direction="column" align="center" mb="5">
						<Heading size="8" mb="2" align="center">
							Case studies
						</Heading>
						<Text align="center" size="4" mb="3" as="p" style={{
            "max-width": "480px"
          }} color="gray">
							These endorsements describe the original React project, not this native Solid fork.
						</Text>
					</Flex>
					<Grid gap="1px" align="center" columns={{
          initial: "1",
          sm: "2",
          md: "3"
        }} mb="8" style={{
          "place-items": "stretch",
          "grid-auto-rows": "200px"
        }}>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/acid-tango",
              children: <>
								<AccessibleIcon label="Acid Tango case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Acid Tango" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/atom-learning",
              children: <>
								<AccessibleIcon label="Atom Learning case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Atom Learning" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/basedash",
              children: <>
								<AccessibleIcon label="Basedash case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Basedash" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/basement-studio",
              children: <>
								<AccessibleIcon label="basement.studio case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="basement.studio" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/codesandbox",
              children: <>
								<AccessibleIcon label="CodeSandbox case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="CodeSandbox" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/composer",
              children: <>
								<AccessibleIcon label="Composer case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Composer" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/compound",
              children: <>
								<AccessibleIcon label="Compound case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Compound" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/linear",
              children: <>
								<AccessibleIcon label="Linear case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Linear" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/liveblocks",
              children: <>
								<AccessibleIcon label="Liveblocks case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Liveblocks" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/magnetis",
              children: <>
								<AccessibleIcon label="Magnetis case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Magnetis" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/supabase",
              children: <>
								<AccessibleIcon label="Supabase case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Supabase" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/nodejs",
              children: <>
								<AccessibleIcon label="Node.js case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Node.js" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/teamflow",
              children: <>
								<AccessibleIcon label="Teamflow case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Teamflow" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/university-of-amsterdam",
              children: <>
								<AccessibleIcon label="University of Amsterdam case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="University of Amsterdam" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
						<LogoLink variant="box" asChild>{target => target("a", {
              "href": "/primitives/case-studies/vercel",
              children: <>
								<AccessibleIcon label="Vercel case study">{target => target(Flex, {
                    "justify": "center",
                    "height": "100%",
                    children: <>
										<CaseStudyLogo variant="Vercel" />
									</>
                  })}</AccessibleIcon>
							</>
            })}</LogoLink>
					</Grid>

					<Separator size="2" mb="8" mx="auto" />

					<Box mb="5" mx="auto" maxWidth="480px">
						<Heading mb="2" size="4" as="h2" align="center">
							Original Radix case-study submissions
						</Heading>

						<Text align="center" as="p">
							The upstream team’s external submission form:
							<Flex display="inline-flex" align="center" gap="2" asChild>{target => target(Link, {
                "href": "https://form.typeform.com/to/FxOiONsk",
                "target": "_blank",
                "highContrast": true,
                "color": "gray",
                children: <>
									Submit to the original Radix project
									<ArrowTopRightIcon />
								</>
              })}</Flex>
						</Text>
					</Box>
				</Section>

				<Footer />
			</Container>
		</>;
}
