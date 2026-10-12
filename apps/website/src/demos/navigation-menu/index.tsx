import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { NavigationMenu } from "@radix-solid/primitives";
import { CaretDownIcon } from "@radix-solid/icons";
import styles from "./styles.module.css";
const NavigationMenuDemo = () => {
  return <NavigationMenu.Root class={styles.Root}>
			<NavigationMenu.List class={styles.MenuList}>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger class={styles.Trigger}>
						Learn <CaretDownIcon class={styles.CaretDown} aria-hidden="true" />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content class={styles.Content}>
						<ul class={`${styles.List} one`}>
							<li style={{
              "grid-row": "span 3"
            }}>
								<NavigationMenu.Link asChild>{target => target("a", {
                  "class": styles.Callout,
                  "href": "#",
                  children: <>
										<svg aria-hidden="true" width="38" height="38" viewBox="0 0 25 25" fill="white">
											<path d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"></path>
											<path d="M12 0H4V8H12V0Z"></path>
											<path d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"></path>
										</svg>
										<div class={styles.CalloutHeading}>
											Radix Primitives
										</div>
										<p class={styles.CalloutText}>
											Unstyled, accessible components for React.
										</p>
									</>
                })}</NavigationMenu.Link>
							</li>

							<ListItem href="https://stitches.dev/" title="Stitches">
								CSS-in-JS with best-in-class developer experience.
							</ListItem>
							<ListItem href="/colors" title="Colors">
								Beautiful, thought-out palettes with auto dark mode.
							</ListItem>
							<ListItem href="https://icons.radix-ui.com/" title="Icons">
								A crisp set of 15x15 icons, balanced and consistent.
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Trigger class={styles.Trigger}>
						Overview <CaretDownIcon class={styles.CaretDown} aria-hidden="true" />
					</NavigationMenu.Trigger>
					<NavigationMenu.Content class={styles.Content}>
						<ul class={`${styles.List} two`}>
							<ListItem title="Introduction" href="/primitives/docs/overview/introduction">
								Build high-quality, accessible design systems and web apps.
							</ListItem>
							<ListItem title="Getting started" href="/primitives/docs/overview/getting-started">
								A quick tutorial to get you up and running with Radix
								Primitives.
							</ListItem>
							<ListItem title="Styling" href="/primitives/docs/guides/styling">
								Unstyled and compatible with any styling solution.
							</ListItem>
							<ListItem title="Animation" href="/primitives/docs/guides/animation">
								Use CSS keyframes or any animation library of your choice.
							</ListItem>
							<ListItem title="Accessibility" href="/primitives/docs/overview/accessibility">
								Follows the WAI-ARIA authoring practices.
							</ListItem>
							<ListItem title="Releases" href="/primitives/docs/overview/releases">
								Radix Primitives releases and their changelogs.
							</ListItem>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>

				<NavigationMenu.Item>
					<NavigationMenu.Link class={styles.Link} href="https://github.com/radix-ui">
						Github
					</NavigationMenu.Link>
				</NavigationMenu.Item>

				<NavigationMenu.Indicator class={styles.Indicator}>
					<div class={styles.Arrow} />
				</NavigationMenu.Indicator>
			</NavigationMenu.List>

			<div class={styles.ViewportPosition}>
				<NavigationMenu.Viewport class={styles.Viewport} />
			</div>
		</NavigationMenu.Root>;
};
const ListItem = function ListItem(p: JSX.IntrinsicElements["a"]) {
  return <li>
			<NavigationMenu.Link asChild>{target => target("a", {
        "class": [styles.ListItemLink, p.class],
        ...omit(p, "children", "class"),
        "ref": p.ref,
        children: <>
					<div class={styles.ListItemHeading}>{p.title}</div>
					<p class={styles.ListItemText}>{p.children}</p>
				</>
      })}</NavigationMenu.Link>
		</li>;
};
export default NavigationMenuDemo;