import { Form } from "@wsagency/radix2solid-primitives";
import "./styles.css";
const FormDemo = () => <Form.Root class="FormRoot">
		<Form.Field class="FormField" name="email">
			<div style={{
      "display": "flex",
      "align-items": "baseline",
      "justify-content": "space-between"
    }}>
				<Form.Label class="FormLabel">Email</Form.Label>
				<Form.Message class="FormMessage" match="valueMissing">
					Please enter your email
				</Form.Message>
				<Form.Message class="FormMessage" match="typeMismatch">
					Please provide a valid email
				</Form.Message>
			</div>
			<Form.Control asChild>{target => target("input", {
        "class": "Input",
        "type": "email",
        "required": true
      })}</Form.Control>
		</Form.Field>
		<Form.Field class="FormField" name="question">
			<div style={{
      "display": "flex",
      "align-items": "baseline",
      "justify-content": "space-between"
    }}>
				<Form.Label class="FormLabel">Question</Form.Label>
				<Form.Message class="FormMessage" match="valueMissing">
					Please enter a question
				</Form.Message>
			</div>
			<Form.Control asChild>{target => target("textarea", {
        "class": "Textarea",
        "required": true
      })}</Form.Control>
		</Form.Field>
		<Form.Submit asChild>{target => target("button", {
      "class": "Button",
      "style": {
        "margin-top": "10px"
      },
      children: <>
				Post question
			</>
    })}</Form.Submit>
	</Form.Root>;
export default FormDemo;