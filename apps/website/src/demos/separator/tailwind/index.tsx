import { Separator } from "@radix-solid/primitives";
const SeparatorDemo = () => <div class="mx-[15px] w-full max-w-[300px]">
		<div class="text-[15px] font-medium leading-5 text-white">
			Radix Primitives
		</div>
		<div class="text-[15px] leading-5 text-white">
			An open-source UI component library.
		</div>
		<Separator.Root class="my-[15px] bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
		<div class="flex h-5 items-center">
			<div class="text-[15px] leading-5 text-white">Blog</div>
			<Separator.Root class="mx-[15px] bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" decorative orientation="vertical" />
			<div class="text-[15px] leading-5 text-white">Docs</div>
			<Separator.Root class="mx-[15px] bg-violet6 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" decorative orientation="vertical" />
			<div class="text-[15px] leading-5 text-white">Source</div>
		</div>
	</div>;
export default SeparatorDemo;