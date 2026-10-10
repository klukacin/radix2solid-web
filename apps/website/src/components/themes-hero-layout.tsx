
import type { JSX } from "@solidjs/web";
import { omit, createSignal, onSettled } from "solid-js";
import styles from "./themes-hero-layout.module.css";
const ThemesHeroLayoutRoot = (p: JSX.IntrinsicElements["div"]) => <div class={styles.ThemesHeroLayoutRoot} {...omit(p, "children")}>
		<div class={styles.ThemesHeroLayoutContent}>{p.children}</div>
	</div>;
const ThemesHeroLayoutBackground = (props: JSX.IntrinsicElements["div"]) => <div class={styles.ThemesHeroLayoutBackground} {...props} />;
const ThemesHeroLayoutMain = (props: JSX.IntrinsicElements["div"]) => <div class={styles.ThemesHeroLayoutMain} {...props} />;
const ThemesHeroLayoutControls = (props: JSX.IntrinsicElements["div"]) => {
  const [rendered, setRendered] = createSignal(false);
  onSettled(() => {
    setRendered(true);
  });
  return <>{rendered() && <div class={styles.ThemesHeroLayoutControls} {...props} />}</>;
};
const ThemesHeroLayoutShowcase = (p: JSX.IntrinsicElements["div"]) => {
  return <div class={styles.ThemesHeroLayoutShowcase} aria-hidden="true">
			<div class={styles.ThemesHeroLayoutShowcaseInner}>
				{/* An extra div is needed to have padding working as expected within the scroll container */}
				<div>
					<div class={styles.ThemesHeroLayoutShowcaseInnerScaled}>{p.children}</div>
				</div>
			</div>
		</div>;
};
export const ThemesHeroLayout = {
  Root: ThemesHeroLayoutRoot,
  Background: ThemesHeroLayoutBackground,
  Main: ThemesHeroLayoutMain,
  Controls: ThemesHeroLayoutControls,
  Showcase: ThemesHeroLayoutShowcase
};