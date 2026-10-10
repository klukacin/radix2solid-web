
import { Link } from "@radix-solid/themes";
import { useSiteContext } from "./site-context";
import { Header, HeaderProps } from "./header";
export const ThemesHeader = (props: HeaderProps) => {
  const pathname = useSiteContext().path;
  return <Header gitHubLink="https://github.com/klukacin/radix2solid" {...props}>
			<Link asChild size="2" color="gray" highContrast={pathname?.includes("/themes/docs")}>{target => target("a", {
        "href": "/themes/docs/overview/getting-started",
        children: <>Documentation</>
      })}</Link>
			<Link asChild size="2" color="gray" highContrast={pathname?.includes("/themes/playground")}>{target => target("a", {
        "href": "/themes/playground",
        children: <>Playground</>
      })}</Link>
		</Header>;
};
