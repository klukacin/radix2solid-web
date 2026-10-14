import { Flex, Heading, Badge, Link, Text } from "@wsagency/radix2solid-themes";
export function PackageRelease(p: {
  id: string;
  major?: boolean;
  name: string;
  version?: string;
  preview?: boolean;
}) {
  return <Flex align="center" gap="1" mt="5" mb="-2">
			<Heading size="4" mr="1">
				{p.name}
			</Heading>
			{p.version && <Badge size="1" color={p.major ? "yellow" : "gray"} style={{
      "font-weight": "normal"
    }}>
					{p.version}
				</Badge>}
			{p.major && <Text size="1" color="gray">
					Major
				</Text>}
			{p.preview && <Text size="1" color="gray">
					Preview
				</Text>}
		</Flex>;
}
export function PRLink(p: {
  id: number | number[];
}) {
  const ids = Array.isArray(p.id) ? p.id : [p.id];
  return <Text color="gray" size="2">
			–{" "}
			{ids.map((id, i, arr) => <>
					<Link color="gray" href={`https://github.com/radix-ui/primitives/pull/${id}`} target="_blank" rel="noopener">
						#{id}
					</Link>
					{i < arr.length - 1 ? " " : null}
				</>)}
		</Text>;
}