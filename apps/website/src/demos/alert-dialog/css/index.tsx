import { AlertDialog } from "@radix-solid/primitives";
import "./styles.css";
const AlertDialogDemo = () => <AlertDialog.Root>
		<AlertDialog.Trigger asChild>{target => target("button", {
      "class": "Button violet",
      children: <>Delete account</>
    })}</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay class="AlertDialogOverlay" />
			<AlertDialog.Content class="AlertDialogContent">
				<AlertDialog.Title class="AlertDialogTitle">
					Are you absolutely sure?
				</AlertDialog.Title>
				<AlertDialog.Description class="AlertDialogDescription">
					This action cannot be undone. This will permanently delete your
					account and remove your data from our servers.
				</AlertDialog.Description>
				<div style={{
        "display": "flex",
        "gap": "25px",
        "justify-content": "flex-end"
      }}>
					<AlertDialog.Cancel asChild>{target => target("button", {
            "class": "Button mauve",
            children: <>Cancel</>
          })}</AlertDialog.Cancel>
					<AlertDialog.Action asChild>{target => target("button", {
            "class": "Button red",
            children: <>Yes, delete account</>
          })}</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>;
export default AlertDialogDemo;