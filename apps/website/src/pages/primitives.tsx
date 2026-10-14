import { Container, Section } from "@wsagency/radix2solid-themes";
import { Footer } from "../components/footer";
import { AccessibilitySection } from "../components/marketing/accessibility-section";
import { AdoptionSection } from "../components/marketing/adoption-section";
import { BenefitsSection } from "../components/marketing/benefits-section";
import { CaseStudiesSection } from "../components/marketing/case-studies-section";
import { CommunitySection } from "../components/marketing/community-section";
import { ComponentHighlightsSection } from "../components/marketing/component-highlights-section";
import { DeveloperExperienceSection } from "../components/marketing/developer-experience-section";
import { FancyBackground } from "../components/marketing/fancy-background";
import { PrimitivesHero } from "../components/marketing/primitives-hero";
import { StatsSection } from "../components/marketing/stats-section";
import { Box, Separator } from "@wsagency/radix2solid-themes";
import { PrimitivesHeader } from "../components/primitives-header";
import { PrimitivesMobileMenu } from "../components/primitives-mobile-menu";
export default function PrimitivesHome() {
  return <>
			<PrimitivesMobileMenu />
			<Box style={{
      "height": 0 as const
    }}>
				<PrimitivesHeader ghost />
			</Box>
			<FancyBackground>
				<PrimitivesHero />
			</FancyBackground>
			<CaseStudiesSection />
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Separator size="2" />
			</Container>
			<Box overflow="hidden">
				<BenefitsSection />
				<StatsSection />
			</Box>
			<ComponentHighlightsSection />
			<AccessibilitySection />
			<DeveloperExperienceSection />
			<AdoptionSection />
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Separator size="2" />
			</Container>
			<Section size={{
      initial: "2",
      md: "4"
    }}>
				<Container mx={{
        initial: "5",
        xs: "6",
        sm: "7",
        md: "9"
      }}>
					<CommunitySection />
				</Container>
			</Section>
			<Container mx={{
      initial: "5",
      xs: "6",
      sm: "7",
      md: "9"
    }}>
				<Separator size="2" />
				<Section size={{
        initial: "2",
        md: "4"
      }} pb="0">
					<Footer />
				</Section>
			</Container>
		</>;
}
