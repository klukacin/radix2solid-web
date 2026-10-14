import { Header } from '../components/header';
import { MarketingMobileMenu } from '../components/marketing-mobile-menu';
type BlogMetadata = { metaTitle: string; metaDescription: string; metaImage: string; publishedAt: string };
const blogMetadata = import.meta.glob<BlogMetadata>('../../data/blog/**/*.mdx', { eager: true, query: '?frontmatter', import: 'default' });
const blogPosts = Object.entries(blogMetadata).map(([file, metadata]) => ({ ...metadata, slug: file.slice('../../data/'.length).replace(/\.mdx$/, '') }));
import { Box, Card, Container, Flex, Grid, Heading, Inset, Link, Section, Separator, Text } from "@wsagency/radix2solid-themes";
import { CommunitySection } from "../components/marketing/community-section";
import { Footer } from "../components/footer";
const description = "Historical news from the original Radix team. This site is an independent native Solid fork.";
export default function RadixBlog() {
  const frontmatters = blogPosts;
  return <><MarketingMobileMenu header={<Header />} /><Header />
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
					<Box mb="7">
						<Heading as="h1" size="8" mb="2">
							Latest updates
						</Heading>

						<Text size="4" color="gray" as="p">
							{description}
						</Text>
					</Box>
					<Flex direction="column">
						{frontmatters.map(({
            metaTitle,
            metaDescription,
            slug,
            metaImage,
            publishedAt
          }) => <Card size="3" variant="classic" asChild>{target => target("a", {
              "href": `/${slug}`,
              children: <>
									<Grid columns={{
                  initial: "1",
                  sm: "2"
                }} width="100%">
										<Inset clip="padding-box" side={{
                    initial: "top",
                    sm: "left"
                  }} pb={{
                    initial: "current",
                    sm: "0"
                  }} pr={{
                    initial: "0",
                    sm: "current"
                  }}>
											<img src={metaImage} alt={metaTitle} style={{
                      "display": "block",
                      "object-fit": "cover",
                      "object-position": "left top",
                      "height": "100%",
                      "width": "100%",
                      "background-color": "var(--gray-3)",
                      "box-shadow": "0 0 0 1px var(--gray-3)"
                    }} />
										</Inset>
										<Flex justify="between" direction="column">
											<Box>
												<Text color="gray" mb="1" as="p" size="2" wrap="balance">
													{publishedAt}
												</Text>
												<Heading as="h2" size="6" mb="3" wrap="balance">
													{metaTitle}
												</Heading>
												<Text as="p" mb="5" color="gray">
													{metaDescription}
												</Text>
											</Box>
											<Link asChild>{target => target(Box, {
                        children: <>Read more →</>
                      })}</Link>
										</Flex>
									</Grid>
								</>
            })}</Card>)}
					</Flex>
				</Container>
			</Section>

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
