import { HoverCard } from "@wsagency/radix2solid-primitives";
import "./styles.css";
const HoverCardDemo = () => <HoverCard.Root>
		<HoverCard.Trigger asChild>{target => target("a", {
      "class": "ImageTrigger",
      "href": "https://twitter.com/radix_ui",
      "target": "_blank",
      "rel": "noreferrer noopener",
      children: <>
				<img class="Image normal" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35' fill='%231C2024'%3E%3Cpath d='M17 35C10.3726 35 5 30.0751 5 24C5 17.9249 10.3726 13 17 13L17 35Z'/%3E%3Crect x='5' width='12' height='12'/%3E%3Ccircle cx='24' cy='6' r='6'/%3E%3C/svg%3E" alt="Radix UI" />
			</>
    })}</HoverCard.Trigger>
		<HoverCard.Portal>
			<HoverCard.Content class="HoverCardContent" sideOffset={5}>
				<div style={{
        "display": "flex",
        "flex-direction": "column",
        "gap": "7px"
      }}>
					<img class="Image large" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35' fill='%231C2024'%3E%3Cpath d='M17 35C10.3726 35 5 30.0751 5 24C5 17.9249 10.3726 13 17 13L17 35Z'/%3E%3Crect x='5' width='12' height='12'/%3E%3Ccircle cx='24' cy='6' r='6'/%3E%3C/svg%3E" alt="Radix UI" />
					<div style={{
          "display": "flex",
          "flex-direction": "column",
          "gap": "15px"
        }}>
						<div>
							<div class="Text bold">Radix</div>
							<div class="Text faded">@radix_ui</div>
						</div>
						<div class="Text">
							Components, icons, colors, and templates for building
							high-quality, accessible UI. Free and open-source.
						</div>
						<div style={{
            "display": "flex",
            "gap": "15px"
          }}>
							<div style={{
              "display": "flex",
              "gap": "5px"
            }}>
								<div class="Text bold">0</div>{" "}
								<div class="Text faded">Following</div>
							</div>
							<div style={{
              "display": "flex",
              "gap": "5px"
            }}>
								<div class="Text bold">2,900</div>{" "}
								<div class="Text faded">Followers</div>
							</div>
						</div>
					</div>
				</div>

				<HoverCard.Arrow class="HoverCardArrow" />
			</HoverCard.Content>
		</HoverCard.Portal>
	</HoverCard.Root>;
export default HoverCardDemo;