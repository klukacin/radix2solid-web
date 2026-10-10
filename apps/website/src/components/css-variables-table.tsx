import { type Element } from "solid-js";
import { Box, Code, Table } from "@radix-solid/themes";
type KeyboardDef = {
  cssVariable: string;
  description: Element | (() => Element);
};
export function CssVariablesTable(p: {
  data: KeyboardDef[];
}) {
  return <Box my="5" asChild>{target => target(Table.Root, {
      "variant": "surface",
      children: <>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell style={{
              "width": "37%"
            }}>CSS Variable</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{p.data.map(({
            cssVariable,
            description
          }, i) => {
            return <Table.Row>
								<Table.RowHeaderCell>
									<Code size="2" style={{
                  "white-space": "normal"
                }}>
										{cssVariable}
									</Code>
								</Table.RowHeaderCell>
								<Table.Cell>{typeof description === 'function' ? description() : description}</Table.Cell>
							</Table.Row>;
          })}
				</Table.Body>
			</>
    })}</Box>;
}