import { Form } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const FormDemo = () => <Form.Root class={styles.Root}>
		<Form.Field class={styles.Field} name="email">
			<div style={{
      "display": "flex",
      "align-items": "baseline",
      "justify-content": "space-between"
    }}>
				<Form.Label class={styles.Label}>Email</Form.Label>
				<Form.Message class={styles.Message} match="valueMissing">
					Please enter your email
				</Form.Message>
				<Form.Message class={styles.Message} match="typeMismatch">
					Please provide a valid email
				</Form.Message>
			</div>
			<Form.Control asChild>{target => target("input", {
        "class": styles.Input,
        "type": "email",
        "required": true
      })}</Form.Control>
		</Form.Field>
		<Form.Field class={styles.Field} name="question">
			<div style={{
      "display": "flex",
      "align-items": "baseline",
      "justify-content": "space-between"
    }}>
				<Form.Label class={styles.Label}>Question</Form.Label>
				<Form.Message class={styles.Message} match="valueMissing">
					Please enter a question
				</Form.Message>
			</div>
			<Form.Control asChild>{target => target("textarea", {
        "class": styles.Textarea,
        "required": true
      })}</Form.Control>
		</Form.Field>
		<Form.Submit asChild>{target => target("button", {
      "class": styles.Button,
      "style": {
        "margin-top": "10px"
      },
      children: <>
				Post question
			</>
    })}</Form.Submit>
	</Form.Root>;
export default FormDemo;