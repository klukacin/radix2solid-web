
import type { JSX } from "@solidjs/web";
import { type Element, createSignal, createMemo, onCleanup, onSettled, omit, type ComponentProps } from "solid-js";
import { AccessibleIcon, Flex, IconButton, Link, Theme, Tooltip } from "@radix-solid/themes";
import styles from "./header.module.css";
import { BoxLink } from "./box-link";
import { ThemeToggle } from "./theme-toggle";
import { GitHubLogoIcon, HamburgerMenuIcon } from "@radix-solid/icons";
import { Radix2SolidLogo, Radix2SolidLogoIcon } from "./radix-logo";
import { useSiteContext } from "./site-context";
export interface HeaderProps {
  children?: Element;
  gitHubLink?: string;
  ghost?: boolean;
}
type ScrollState = "at-top" | "scrolling-up" | "scrolling-down";
export const Header = (p: HeaderProps) => {
  const site = useSiteContext();
  const mobileMenu = {
    get open() {
      return site.mobileOpen;
    },
    setOpen: site.setMobileOpen
  };
  const navigationTooltipOpen = createMemo(() => mobileMenu.open ? false : undefined);
  const pathname = site.path;
  const [headerGap, setHeaderGap] = createSignal("0px");
  const [scrollState, setScrollState] = createSignal<ScrollState>("at-top");
  onSettled(() => {
    let previousScrollY = window.scrollY;
    const handleScroll = () => {
      const direction = previousScrollY < window.scrollY ? "scrolling-down" : "scrolling-up";
      const state = window.scrollY < 30 ? "at-top" : direction;
      previousScrollY = window.scrollY;
      setScrollState(state);
    };
    if (p.ghost) {
      addEventListener("scroll", handleScroll, {
        passive: true
      });
    } else {
      removeEventListener("scroll", handleScroll);
    }
    handleScroll();
    const body = document.body;
    const padding = parseFloat(getComputedStyle(body).paddingRight || "0");
    const observer = new MutationObserver(() => setHeaderGap(`${Math.max(0, parseFloat(body.style.paddingRight || "0") - padding)}px`));
    observer.observe(body, {
      attributes: true,
      attributeFilter: ["style"]
    });
    onCleanup(() => {
      removeEventListener("scroll", handleScroll);
      observer.disconnect();
    });
  });
  return <Theme asChild class="radix-themes-custom-fonts">{target => {
      const nativeProps: JSX.IntrinsicElements["div"] & {
        "data-scroll-state": unknown;
        "data-mobile-menu-open": unknown;
      } = {
        get "data-scroll-state"() {
          return scrollState();
        },
        get "data-mobile-menu-open"() {
          return String(mobileMenu.open);
        },
        get "class"() {
          return [styles.HeaderRoot, p.ghost ? styles.ghost : ""];
        },
        children: <>
				<div class={styles.HeaderInner}>
					
					<div class={"native-scroll-compensation"} style={{
              "position": "absolute",
              "height": "inherit",
              "top": 0 as const,
              "left": 0 as const,
              "right": headerGap()
            }}>
						<Flex display={{
                sm: "none"
              }} align="center" position="absolute" top="0" bottom="0" left="0" pl="4">
							{mobileMenu.open ? <BoxLink asChild>{target => target("a", {
                    "href": "/",
                    children: <>
										<AccessibleIcon label="Radix2Solid homepage">{target => target(Radix2SolidLogoIcon, {})}</AccessibleIcon>
									</>
                  })}</BoxLink> : <Radix2SolidLogoLink />}
						</Flex>

						<Flex display={{
                initial: "none",
                sm: "flex"
              }} align="center" position="absolute" top="0" bottom="0" left="0" pl="4">
							<Radix2SolidLogoLink />
						</Flex>

						<div class={styles.HeaderProductLinksContainer}>
							<HeaderProductLink href="/" active={pathname === "/" || pathname?.startsWith("/themes")}>
								Themes
							</HeaderProductLink>
							<HeaderProductLink href="/primitives" active={pathname?.startsWith("/primitives")}>
								Primitives
							</HeaderProductLink>
							<HeaderProductLink href="/icons" active={pathname?.startsWith("/icons")}>
								Icons
							</HeaderProductLink>
							<HeaderProductLink href="/colors" active={pathname?.startsWith("/colors")}>
								Colors
							</HeaderProductLink>
						</div>

						<Flex display={{
                initial: "none",
                md: "flex"
              }} align="center" gap="5" position="absolute" top="0" bottom="0" right="0" pr="4">
							{p.children}

							<Link size="2" color="gray" href="/blog" highContrast={pathname?.includes("/blog")}>
								Blog
							</Link>

							{p.gitHubLink && <Tooltip class="radix-themes-custom-fonts" content="View GitHub">{target => target(IconButton, {
                    "asChild": true,
                    "size": "3",
                    "variant": "ghost",
                    "color": "gray",
                    children: target => target("a", {
                      get "href"() {
                        return p.gitHubLink;
                      },
                      "target": "_blank",
                      "aria-label": "View GitHub",
                      children: <>
											<GitHubLogoIcon width="16" height="16" />
										</>
                    })
                  })}</Tooltip>}

							<ThemeToggle />
						</Flex>

						<Flex display={{
                md: "none"
              }} align="center" gap="4" position="absolute" top="0" bottom="0" right="0" pr="4">
              {p.gitHubLink && <IconButton asChild size="3" variant="ghost" color="gray">{target => target("a", {
                href: p.gitHubLink, target: "_blank", rel: "noopener noreferrer", "aria-label": "View GitHub",
                children: <GitHubLogoIcon width="16" height="16" />
              })}</IconButton>}
							<div class={styles.HeaderThemeToggleContainer}>
								<ThemeToggle />
							</div>

							<Tooltip class="radix-themes-custom-fonts" content="Navigation" open={navigationTooltipOpen()}>{target => {
                    const nativeProps: Exclude<ComponentProps<typeof IconButton>, {
                      asChild: true;
                    }> & {
                      "data-state": unknown;
                    } = {
                      "size": "3",
                      "variant": "ghost",
                      "color": "gray",
                      get "aria-label"() {
                        return mobileMenu.open ? "Close navigation" : "Open navigation";
                      },
                      get "data-state"() {
                        return mobileMenu.open ? "open" : "closed";
                      },
                      "onClick": () => mobileMenu.setOpen(open => !open),
                      get "class"() {
                        return styles.MobileMenuButton;
                      },
                      children: <>
									<HamburgerMenuIcon width="16" height="16" />
								</>
                    };
                    return target(IconButton, nativeProps);
                  }}</Tooltip>
						</Flex>
					</div>
				</div>
			</>
      };
      return target("div", nativeProps);
    }}</Theme>;
};
const HeaderProductLink = (p: Omit<JSX.IntrinsicElements["a"], "href"> & {
  active?: boolean;
  href: string;
}) => <a href={p.href} data-state={p.active ? "active" : "inactive"} class={styles.HeaderProductLink} {...omit(p, "active", "children", "href")}>
		<span class={styles.HeaderProductLinkInner}>{p.children}</span>
		<span class={styles.HeaderProductLinkInnerHidden}>{p.children}</span>
	</a>;
const Radix2SolidLogoLink = () => <BoxLink asChild>{target => target("a", {
  href: "/", children: <AccessibleIcon label="Radix2Solid homepage">{target => target(Radix2SolidLogo, {})}</AccessibleIcon>
})}</BoxLink>;
