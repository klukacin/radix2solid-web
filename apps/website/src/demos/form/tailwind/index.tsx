import { Form } from "@radix-solid/primitives";
const FormDemo = () => <Form.Root class="w-[260px]">
		<Form.Field class="mb-2.5 grid" name="email">
			<div class="flex items-baseline justify-between">
				<Form.Label class="text-[15px] font-medium leading-[35px] text-white">
					Email
				</Form.Label>
				<Form.Message class="text-[13px] text-white opacity-80" match="valueMissing">
					Please enter your email
				</Form.Message>
				<Form.Message class="text-[13px] text-white opacity-80" match="typeMismatch">
					Please provide a valid email
				</Form.Message>
			</div>
			<Form.Control asChild>{target => target("input", {
        "class": "box-border inline-flex h-[35px] w-full appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]",
        "type": "email",
        "required": true
      })}</Form.Control>
		</Form.Field>
		<Form.Field class="mb-2.5 grid" name="question">
			<div class="flex items-baseline justify-between">
				<Form.Label class="text-[15px] font-medium leading-[35px] text-white">
					Question
				</Form.Label>
				<Form.Message class="text-[13px] text-white opacity-80" match="valueMissing">
					Please enter a question
				</Form.Message>
			</div>
			<Form.Control asChild>{target => target("textarea", {
        "class": "box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded bg-blackA2 p-2.5 text-[15px] leading-none text-white shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]",
        "required": true
      })}</Form.Control>
		</Form.Field>
		<Form.Submit asChild>{target => target("button", {
      "class": "mt-2.5 box-border inline-flex h-[35px] w-full items-center justify-center rounded bg-white px-[15px] font-medium leading-none text-violet11 shadow-[0_2px_10px] shadow-blackA4 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none",
      children: <>
				Post question
			</>
    })}</Form.Submit>
	</Form.Root>;
export default FormDemo;