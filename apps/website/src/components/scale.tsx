
import { createEffect, createSignal } from "solid-js";
import { Box, DropdownMenu, Flex, IconButton, Text, Tooltip } from "@wsagency/radix2solid-themes";
import { CopyIcon } from "@wsagency/radix2solid-icons";
import * as Colors from "@radix-ui/colors";
import Color from 'colorjs.io';
type Scale = Record<string, string>;
const toCssCasing = (str: string) => str.replace(/([a-z])(\d)/, "$1-$2").replace(/([A-Z])/g, "-$1").toLowerCase();
const scaleToHSLObject = (name: string, scale: Scale) => {
  const values = Object.entries(scale).map(([key, val]) => `	${key}: "${new Color(val).to('hsl').toString()}",`).join("\n");
  return `const ${name} = {\n${values}\n}`;
};
const scaleToHexObject = (name: string, scale: Scale) => {
  const values = Object.entries(scale).map(([key, value]) => {
    const hex = new Color(value).to('srgb').toString({ format: 'hex', collapse: false });
    return `	${key}: "${hex}",`;
  }).join("\n");
  return `const ${name} = {\n${values}\n}`;
};
const scaleToCSS = (name: string, scale: Scale) => {
  const values = Object.entries(scale).map(([key, val]) => [toCssCasing(key), val]).map(([key, val]) => `	--${key}: ${val};`).join("\n");
  return `.${name} {\n${values}\n}`;
};
const scaleToSASS = (scale: Scale) => {
  return Object.entries(scale).map(([key, val]) => [toCssCasing(key), val]).map(([key, val]) => `$${key}: ${val};`).join("\n");
};
const scaleToLESS = (scale: Scale) => {
  return Object.entries(scale).map(([key, val]) => [toCssCasing(key), val]).map(([key, val]) => `@${key}: ${val};`).join("\n");
};
const scaleToSvg = (scale: Record<string, string>, valueWidth: number = 50, valueHeight: number = 35) => {
  const values = Object.values(scale);
  return `<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${values.length * valueWidth} ${valueHeight}">${values.map((value, i) => {
    const x = i * valueWidth;
    const color = new Color(value).to('srgb');
    const alpha = color.alpha;
    color.alpha = 1;
    const hex = color.toString({ format: 'hex', collapse: false });
    return `<rect x="${x}" width="${valueWidth}" height="${valueHeight}" fill="${hex}" fill-opacity="${alpha}" />`;
  }).join("")}</svg>`;
};

const colorKeys = Object.keys(Colors.gray);
export const ColorScaleGroup = (p: {
  children: any;
}) => {
  return <>
			<Flex style={{
      "gap": "1px"
    }}>
				<Box height="24px" style={{
        "width": "140px"
      }} />
				{colorKeys.map((key, i) => <Box flexGrow="0" flexShrink="1" width="48px">
						<Text as="div" color="gray" size="1" align="center">
							{i + 1}
						</Text>
					</Box>)}
				<Box />
			</Flex>
			{p.children}
		</>;
};
export const ColorScale = (p: {
  label: string;
  name: keyof typeof Colors;
}) => {
  const [isHovered, setIsHovered] = createSignal(false);
  const [dropdownMenuIsOpen, setDropdownMenuIsOpen] = createSignal(false);
  const [element, setElement] = createSignal<HTMLDivElement>();
  createEffect(element, row => { setIsHovered(!!row?.matches(':hover')); });
  const scale = Colors[p.name];
  const isAlpha = p.name.endsWith("A");
  const isDarkAlpha = p.name.endsWith("DarkA");
  const isWhiteA = p.name.endsWith("whiteA");
  return <Flex ref={setElement} position="relative" style={{
    "margin-right": "-25px"
  }} onMouseMove={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
			<Flex style={{
      "width": "calc(100% - 25px)",
      "gap": "1px",
      "margin-bottom": "1px"
    }}>
				<Flex align="center" height="32px" style={{
        "width": "140px"
      }}>
					<Text color="gray" size="1">
						{p.label}
					</Text>
				</Flex>
				{Object.values(scale).map((value, i) => {
        return <Box height="32px" width="48px" flexShrink="1" style={{
          // Show transparency grid for all alpha colors
          ...(isAlpha ? {
            "background-color": isWhiteA || isDarkAlpha ? "#181818" : "#ffffff",
            "background-size": "16px 16px",
            "background-position": "0 0, 8px 0, 8px -8px, 0 8px",
            "background-image": isWhiteA || isDarkAlpha ? `
              linear-gradient(45deg, #222222 25%, transparent 25%),
              linear-gradient(135deg, #222222 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #222222 75%),
              linear-gradient(135deg, transparent 75%, #222222 75%)` : `
              linear-gradient(45deg, #f8f8f8 25%, transparent 25%),
              linear-gradient(135deg, #f8f8f8 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f8f8f8 75%),
              linear-gradient(135deg, transparent 75%, #f8f8f8 75%)`
          } : {
            "background-color": "transparent"
          })
        }}>
							<Box width="100%" height="100%" style={{
            "background-color": value
          }} />
						</Box>;
      })}
			</Flex>
			{(isHovered() || dropdownMenuIsOpen()) && <Flex align="center" justify="center" height="32px" position="absolute" right="0" mr="-1">
					<DropdownMenu.Root onOpenChange={isOpen => setDropdownMenuIsOpen(isOpen)}>
						<Tooltip class="radix-themes-custom-fonts" content="Copy to Clipboard">{target => target(DropdownMenu.Trigger, {
            children: target => target(IconButton, {
                "size": "2",
                "variant": "ghost",
                "color": "gray",
                "highContrast": true,
                children: <>
									<CopyIcon />
								</>
              })
          })}</Tooltip>
						<DropdownMenu.Content class="radix-themes-custom-fonts" align="end" size="1">
							<DropdownMenu.Group>
								<DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(scaleToHSLObject(p.name, scale))}>
									Copy as Object (HSL)
								</DropdownMenu.Item>
								<DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(scaleToHexObject(p.name, scale))}>
									Copy as Object (Hex)
								</DropdownMenu.Item>
								<DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(scaleToCSS(p.name, scale))}>
									Copy as CSS
								</DropdownMenu.Item>
								<DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(scaleToLESS(scale))}>
									Copy as LESS
								</DropdownMenu.Item>
								<DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(scaleToSASS(scale))}>
									Copy as Sass
								</DropdownMenu.Item>
								<DropdownMenu.Item onSelect={() => navigator.clipboard.writeText(scaleToSvg(scale))}>
									Copy as SVG
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Flex>}
		</Flex>;
};