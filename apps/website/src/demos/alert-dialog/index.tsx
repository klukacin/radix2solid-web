import { AlertDialog } from "@wsagency/radix2solid-primitives";
import styles from "./styles.module.css";
const AlertDialogDemo = () => <AlertDialog.Root>
		<AlertDialog.Trigger asChild>{target => target("button", {
      "class": `${styles.Button} violet`,
      children: <>Delete account</>
    })}</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay class={styles.Overlay} />
			<AlertDialog.Content class={styles.Content}>
				<AlertDialog.Title class={styles.Title}>
					Are you absolutely sure?
				</AlertDialog.Title>
				<AlertDialog.Description class={styles.Description}>
					This action cannot be undone. This will permanently delete your
					account and remove your data from our servers.
				</AlertDialog.Description>
				<div style={{
        "display": "flex",
        "gap": "25px",
        "justify-content": "flex-end"
      }}>
					<AlertDialog.Cancel asChild>{target => target("button", {
            "class": `${styles.Button} muave`,
            children: <>Cancel</>
          })}</AlertDialog.Cancel>
					<AlertDialog.Action asChild>{target => target("button", {
            "class": `${styles.Button} red`,
            children: <>
							Yes, delete account
						</>
          })}</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>;
export default AlertDialogDemo;