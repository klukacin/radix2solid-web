import { Tabs } from "@radix-solid/primitives";
import styles from "./styles.module.css";
const TabsDemo = () => <Tabs.Root class={styles.Root} defaultValue="tab1">
		<Tabs.List class={styles.List} aria-label="Manage your account">
			<Tabs.Trigger class={styles.Trigger} value="tab1">
				Account
			</Tabs.Trigger>
			<Tabs.Trigger class={styles.Trigger} value="tab2">
				Password
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content class={styles.Content} value="tab1">
			<p class={styles.Text}>
				Make changes to your account here. Click save when you&apos;re done.
			</p>
			<fieldset class={styles.Fieldset}>
				<label class={styles.Label} for="name">
					Name
				</label>
				<input class={styles.Input} id="name" defaultValue="Pedro Duarte" />
			</fieldset>
			<fieldset class={styles.Fieldset}>
				<label class={styles.Label} for="username">
					Username
				</label>
				<input class={styles.Input} id="username" defaultValue="@peduarte" />
			</fieldset>
			<div style={{
      "display": "flex",
      "margin-top": "20px",
      "justify-content": "flex-end"
    }}>
				<button class={`${styles.Button} green`}>Save changes</button>
			</div>
		</Tabs.Content>
		<Tabs.Content class={styles.Content} value="tab2">
			<p class={styles.Text}>
				Change your password here. After saving, you&apos;ll be logged out.
			</p>
			<fieldset class={styles.Fieldset}>
				<label class={styles.Label} for="currentPassword">
					Current password
				</label>
				<input class={styles.Input} id="currentPassword" type="password" />
			</fieldset>
			<fieldset class={styles.Fieldset}>
				<label class={styles.Label} for="newPassword">
					New password
				</label>
				<input class={styles.Input} id="newPassword" type="password" />
			</fieldset>
			<fieldset class={styles.Fieldset}>
				<label class={styles.Label} for="confirmPassword">
					Confirm password
				</label>
				<input class={styles.Input} id="confirmPassword" type="password" />
			</fieldset>
			<div style={{
      "display": "flex",
      "margin-top": "20px",
      "justify-content": "flex-end"
    }}>
				<button class={`${styles.Button} green`}>Change password</button>
			</div>
		</Tabs.Content>
	</Tabs.Root>;
export default TabsDemo;