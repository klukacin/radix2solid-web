import { composeEventHandlers } from '@radix-solid/primitives/internal';

import type { JSX } from "@solidjs/web";
import { type Element, omit, onCleanup, onSettled } from "solid-js";
import { Box, Text, Link, Flex, Container, Heading } from "@radix-solid/themes";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-solid/icons";
import { Carousel, CarouselSlideList, CarouselSlide, CarouselNext, CarouselPrevious } from "./carousel";
import { PrimitivesHeroDialog } from "./primitives-hero-dialog";
import { PrimitivesHeroPopover } from "./primitives-hero-popover";
import { PrimitivesHeroDropdownMenu } from "./primitives-hero-dropdown-menu";
import { PrimitivesHeroSlider } from "./primitives-hero-slider";
import { PrimitivesHeroTabs } from "./primitives-hero-tabs";
import { PrimitivesHeroScrollArea } from "./primitives-hero-scroll-area";
import { PrimitivesHeroAccordion } from "./primitives-hero-accordion";
import { PrimitivesHeroRadioGroup } from "./primitives-hero-radio-group";
import { PrimitivesHeroToggleGroup } from "./primitives-hero-toggle-group";
import { PrimitivesHeroSwitch } from "./primitives-hero-switch";
import { Button, Section } from "@radix-solid/themes";
import { SerifHeading } from "../serif-heading";
import { HiddenScroll } from "./hidden-scroll";
import styles from "./primitives-hero.module.css";
function DemoContainer(p: {
  children: Element;
  ariaUnhide?: boolean;
  component?: string;
}) {
  return <Flex data-component={p.component} class={styles.DemoContainer} position="relative" align="center" justify="center" width={{
    initial: "300px",
    xs: "400px"
  }} height="400px"
  // Content slightly above vertical center feels perfectly centred
  pb="3" mb="2">
			{p.children}
		</Flex>;
}
const FocusArea = function FocusArea(p: JSX.IntrinsicElements["div"] & Pick<JSX.IntrinsicElements["div"], "ref">) {
  const props = omit(p, "children", "onKeyDown");
  return <div {...props} class={styles.FocusArea} data-focus-area="true" ref={p.ref} tabindex={0} onKeyDown={composeEventHandlers<KeyboardEvent & { currentTarget: HTMLDivElement }>(() => p.onKeyDown, event => {

    // Move focus inside the FocusArea when Enter or Spacebar is pressed
    if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
      // We are looking for something obviously focusable
      const tier1 = '[role="menu"], [role="dialog"] input, [role="dialog"] button, [tabindex="0"]';
      const tier2 = "a, button, input, select, textarea";

      // Search for tier 1 and tier 2 elements, prioritising
      const elementToFocus = [event.currentTarget.querySelector<HTMLElement>(tier1), event.currentTarget.querySelector<HTMLElement>(tier2)].filter(el => Boolean(el))[0];
      if (elementToFocus) {
        event.preventDefault();
        elementToFocus.focus();
      }
    }

    // Move focus onto the FocusArea when Escape is pressed, unless the focus is currently inside a modal
    if (event.key === "Escape" && event.target instanceof HTMLElement && event.target !== event.currentTarget && event.target.closest('[role="dialog"], [role="menu"]') === null) {
      event.currentTarget.focus();
    }
  })} role="group">
			<div data-focus-area-entry="true" />
			{p.children}
			<div data-focus-area-exit="true" />
		</div>;
};
export const PrimitivesHero = () => {
  let lastUsedFocusArea: HTMLElement | null | null = null;
  onSettled(() => {
    lastUsedFocusArea = document.querySelector("[data-focus-area]");
  });
  const onFocusAreaFocus = (event: FocusEvent & {
    currentTarget: HTMLElement;
  }) => {
    lastUsedFocusArea = event.currentTarget;
  };

  // We are implementing a simple roving tab index with some tweaks
  const onFocusAreaKeyDown = (event: KeyboardEvent & {
    currentTarget: HTMLElement;
  }) => {
    if (event.target === event.currentTarget) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        const allAreas = Array.from(document.querySelectorAll<HTMLElement>("[data-focus-area]"));
        const thisIndex = allAreas.findIndex(el => el === event.currentTarget);
        const nextIndex = Math.min(thisIndex + 1, allAreas.length - 1);
        const nextDemo = allAreas[nextIndex];
        nextDemo.focus();
        (nextDemo as any).scrollIntoViewIfNeeded?.(true);
        lastUsedFocusArea = nextDemo;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        const allAreas = Array.from(document.querySelectorAll<HTMLElement>("[data-focus-area]"));
        const thisIndex = allAreas.findIndex(el => el === event.currentTarget);
        const prevIndex = Math.max(thisIndex - 1, 0); // thisIndex - 1 >= 0 ? thisIndex - 1 : allAreas.length - 1;
        const prevDemo = allAreas[prevIndex];
        prevDemo.focus();
        (prevDemo as any).scrollIntoViewIfNeeded?.(true);
        lastUsedFocusArea = prevDemo;
      }

      // Tab key press moves focus to the next element after the carousel
      if (event.key === "Tab" && event.shiftKey === false) {
        const selector = "a, button, input, select, textarea, [data-focus-area-exit]";
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(element => element.tabIndex !== -1 || element.hasAttribute("data-focus-area-exit"));

        // Find last exit guard
        elements.reverse();
        const lastExit = elements.find(el => el.matches("[data-focus-area-exit]"));
        elements.reverse();
        const lastExitIndex = elements.indexOf(lastExit!);
        const nextElement = elements[lastExitIndex + 1];
        if (nextElement) {
          event.preventDefault();
          nextElement.focus();
        }
      }

      // Shift + Tab key press moves focus to the previous element before the carousel
      if (event.key === "Tab" && event.shiftKey) {
        const selector = "a, button, input, select, textarea, [data-focus-area-entry]";
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(element => element.tabIndex !== -1 || element.hasAttribute("data-focus-area-entry"));

        // Find first entry guard
        const firstEntry = elements.find(el => el.matches("[data-focus-area-entry]"));
        const firstEntryIndex = elements.indexOf(firstEntry!);
        const prevElement = elements[firstEntryIndex - 1];
        if (prevElement) {
          event.preventDefault();
          prevElement.focus();
        }
      }
    }
  };
  onSettled(() => {
    const tabListener = (event: KeyboardEvent) => {
      // Catch that Tab that lands into carousel contents from
      // elsewhere, and redirect focus to the nearest focus area
      if (event.key === "Tab" && event.shiftKey === false && event.target instanceof HTMLElement && !event.target.hasAttribute("data-focus-area")) {
        const selector = "a, button, input, select, textarea, [data-focus-area-entry]";
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(element => element.tabIndex !== -1 || element === event.target || element.hasAttribute("data-focus-area-entry"));

        // Find first entry guard
        const firstEntryIndex = elements.findIndex(el => el.hasAttribute("data-focus-area-entry"));
        if (elements.indexOf(event.target) + 1 === firstEntryIndex) {
          event.preventDefault();
          lastUsedFocusArea?.focus();
        }
      }

      // Catch that Shift + Tab that lands into carousel contents from
      // elsewhere, and redirect focus to the nearest focus area
      if (event.key === "Tab" && event.shiftKey && event.target instanceof HTMLElement && !event.target.hasAttribute("data-focus-area")) {
        const selector = "a, button, input, select, textarea, [data-focus-area-exit]";
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(element => element.tabIndex !== -1 || element === event.target || element.hasAttribute("data-focus-area-exit"));

        // Find last exit guard
        elements.reverse();
        const lastExit = elements.find(el => el.hasAttribute("data-focus-area-exit"));
        elements.reverse();
        const lastExitIndex = elements.indexOf(lastExit!);
        if (elements.indexOf(event.target) - 1 === lastExitIndex) {
          event.preventDefault();
          lastUsedFocusArea?.focus();
        }
      }
    };
    document.addEventListener("keydown", tabListener);
    onCleanup(() => document.removeEventListener("keydown", tabListener));
  });
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
				<Box mb="6">
					<Box mb="5">
						<SerifHeading mb="3" style={{
            "max-width": "560px"
          }}>
							Core building blocks for your design system
						</SerifHeading>
						<Text size="5" as="p" mb="6" color="gray" style={{
            "max-width": "520px"
          }}>
							Unstyled, accessible, open source Solid 2 primitives for high-quality web apps and
							design systems.
						</Text>
					</Box>
					<Button asChild size={{
          initial: "3",
          xs: "4"
        }} color="gray" highContrast>{target => target("a", {
            "href": "/primitives/docs/overview/introduction",
            children: <>
							Get started
							<svg width="14" height="14" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentcolor" style={{
                "opacity": 1,
                "margin-right": "-3px"
              }}>
								<path d="M6.39205 11.6023L5.36932 10.5909L8.92045 7.03977H0V5.5625H8.92045L5.36932 2.01705L6.39205 1L11.6932 6.30114L6.39205 11.6023Z" />
							</svg>
						</>
          })}</Button>
				</Box>
			</Container>
			<Box position="relative">
				<Carousel>
					<Box asChild ml={{
          initial: "5",
          xs: "6",
          sm: "7",
          md: "9"
        }}>{target => target(HiddenScroll, {
            "asChild": true,
            children: target => target(CarouselSlideList, {
              get "style"(): JSX.CSSProperties {
                return {
                  "display": "grid",
                  "grid-auto-flow": "column",
                  "grid-auto-columns": "min-content",
                  "padding-top": "var(--space-1)",
                  "padding-bottom": "var(--space-1)",
                  "-webkit-overflow-scrolling": "touch",
                  "position": "relative",
                  // Remove the actual margin
                  "--margin-left-override": 0 as const,
                  // Move the responsive margin here
                  "padding-left": "max(var(--margin-left), calc(50% - var(--container-4) / 2))"
                };
              },
              children: <>
								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Dialog component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="dialog">
												<PrimitivesHeroDialog />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Dialog
											</Heading>
											<Text as="p" size="2" color="gray">
												With modal and non-modal modes, fine-grained focus&nbsp;control, accessible
												to screen readers.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Dropdown menu component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="dropdown-menu">
												<PrimitivesHeroDropdownMenu />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Dropdown Menu
											</Heading>
											<Text as="p" size="2" color="gray">
												With submenus, checkable items, collision handling, arrow key navigation,
												and typeahead support.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Popover component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="popover">
												<PrimitivesHeroPopover />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Popover
											</Heading>
											<Text as="p" size="2" color="gray">
												With fine-grained focus control, collision handling, origin-aware and
												collision-aware animations.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Slider component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="slider">
												<PrimitivesHeroSlider />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Slider
											</Heading>
											<Text as="p" size="2" color="gray">
												Supports keyboard and touch input, step interval, multiple thumbs for value
												ranges, and RTL direction.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Scroll area component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="scroll-area">
												<PrimitivesHeroScrollArea />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Scroll Area
											</Heading>
											<Text as="p" size="2" color="gray">
												Supports custom cross-browser styling while maintaining the browser&apos;s
												native scroll behavior.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Tabs component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="tabs">
												<PrimitivesHeroTabs />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Tabs
											</Heading>
											<Text as="p" size="2" color="gray">
												Supports arrow key navigation, horizontal/vertical orientation, controlled
												or uncontrolled.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Accordion component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="accordion">
												<PrimitivesHeroAccordion />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Accordion
											</Heading>
											<Text as="p" size="2" color="gray">
												Supports one or multiple items open at the same time, keyboard navigation,
												collapse and expand animation.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Radio group component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="radio-group">
												<PrimitivesHeroRadioGroup />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Radio Group
											</Heading>
											<Text as="p" size="2" color="gray">
												With arrow key navigation, horizontal/vertical orientation support,
												controlled or uncontrolled.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Toggle group component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="toggle-group">
												<PrimitivesHeroToggleGroup />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Toggle Group
											</Heading>
											<Text as="p" size="2" color="gray">
												A set of two-state buttons that can be toggled on or off. Supports single
												and multiple pressed buttons.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea aria-label="Switch component demo" onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer component="switch">
												<PrimitivesHeroSwitch />
											</DemoContainer>
										</FocusArea>
										<GrabBox>
											<Heading as="h3" size="3" mb="1">
												Switch
											</Heading>
											<Text as="p" size="2" color="gray">
												Allows the user to toggle between checked and not checked.
											</Text>
										</GrabBox>
									</CarouselSlide>
								</Box>

								<Box pr="5">
									<CarouselSlide>
										<FocusArea onKeyDown={onFocusAreaKeyDown} onFocus={onFocusAreaFocus}>
											<DemoContainer ariaUnhide>
												<Flex align="center" direction="column" gap="2">
													<Text size="2" color="gray">
														See more components in the docs
													</Text>
													<Flex asChild display="inline-flex" align="center" gap="1">{target => target(Link, {
                              "asChild": true,
                              "size": "3",
                              "highContrast": true,
                              "color": "gray",
                              children: target => target("a", {
                                "href": "/primitives/docs/overview/getting-started",
                                children: <>
																View docs
																<ArrowRightIcon />
															</>
                              })
                            })}</Flex>
												</Flex>
											</DemoContainer>
										</FocusArea>
									</CarouselSlide>
								</Box>
							</>
            })
          })}</Box>

					<Box style={{
          "position": "absolute",
          "top": "calc(50% - var(--space-9))",
          "left": "15px"
        }}>
						<CarouselPrevious aria-label="Show previous demo" tabindex={-1} as={CarouselArrowButton}>
							<ArrowLeftIcon />
						</CarouselPrevious>
					</Box>
					<Box style={{
          "position": "absolute",
          "top": "calc(50% - var(--space-9))",
          "right": "15px"
        }}>
						<CarouselNext aria-label="Show next demo" tabindex={-1} as={CarouselArrowButton}>
							<ArrowRightIcon />
						</CarouselNext>
					</Box>
				</Carousel>
			</Box>
		</Section>;
};
const CarouselArrowButton = (p: JSX.IntrinsicElements["button"]) => {
  return <button {...omit(p, "children")} type="button" class={styles.CarouselArrowButton}>
			{p.children}
		</button>;
};
const GrabBox = (p: JSX.IntrinsicElements["div"]) => {
  return <div {...omit(p, "children")} class={styles.GrabBox}>
			{p.children}
		</div>;
};
