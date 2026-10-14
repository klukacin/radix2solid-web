import { Text, Box } from "@wsagency/radix2solid-themes";
const steps = ["App background", "Subtle background", "UI element background", "Hovered UI element background", "Active / Selected UI element background", "Subtle borders and separators", "UI element border and focus rings", "Hovered UI element border", "Solid backgrounds", "Hovered solid backgrounds", "Low-contrast text", "High-contrast text"];
export function UseCasesTable() {
  return <Box asChild my="5">{target => target("table", {
      "style": {
        "display": "table",
        "width": "100%",
        "text-align": "left",
        "border-collapse": "collapse"
      },
      children: <>
				<thead>
					<tr>
						<Box asChild py="3" px="4" style={{
              "display": "table-cell",
              "width": "50%",
              "border-bottom": "1px solid var(--gray-a3)"
            }}>{target => target("th", {
                children: <>
								<Text as="p" size="2" color="gray" weight="regular">
									Step
								</Text>
							</>
              })}</Box>
						<Box asChild py="3" px="4" style={{
              "display": "table-cell",
              "border-bottom": "1px solid var(--gray-a3)"
            }}>{target => target("th", {
                children: <>
								<Text as="p" size="2" color="gray" weight="regular">
									Use Case
								</Text>
							</>
              })}</Box>
					</tr>
				</thead>
				<tbody>
					{steps.map((step, i) => <tr>
							<Box asChild py="2" px="4" style={{
              "display": "table-cell",
              "border-bottom": "1px solid var(--gray-a3)",
              "background-color": i % 2 === 0 ? "var(--gray-a2)" : "transparent"
            }}>{target => target("td", {
                children: <>
									<Text size="2" as="p">
										{i + 1}
									</Text>
								</>
              })}</Box>
							<Box asChild py="2" px="4" style={{
              "display": "table-cell",
              "border-bottom": "1px solid var(--gray-a3)",
              "background-color": i % 2 === 0 ? "var(--gray-a2)" : "transparent"
            }}>{target => target("td", {
                children: <>
									<Text size="2" as="p">
										{step}
									</Text>
								</>
              })}</Box>
						</tr>)}
				</tbody>
			</>
    })}</Box>;
}