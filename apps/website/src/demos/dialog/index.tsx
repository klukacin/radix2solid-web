import { createUniqueId } from 'solid-js';
import { Dialog } from '@radix-solid/primitives';
import { Cross2Icon } from '@radix-solid/icons';
import styles from './styles.module.css';

export default function DialogDemo() {
  const name = createUniqueId();
  const username = createUniqueId();
  return <Dialog.Root>
    <Dialog.Trigger asChild>{target => target('button', { class: `${styles.Button} violet`, children: 'Edit profile' })}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay class={styles.Overlay} />
      <Dialog.Content class={styles.Content}>
        <Dialog.Title class={styles.Title}>Edit profile</Dialog.Title>
        <Dialog.Description class={styles.Description}>Make changes to your profile here. Click save when you're done.</Dialog.Description>
        <fieldset class={styles.Fieldset}><label class={styles.Label} for={name}>Name</label><input class={styles.Input} id={name} value="Pedro Duarte" /></fieldset>
        <fieldset class={styles.Fieldset}><label class={styles.Label} for={username}>Username</label><input class={styles.Input} id={username} value="@peduarte" /></fieldset>
        <div style={{ display: 'flex', 'margin-top': '25px', 'justify-content': 'flex-end' }}>
          <Dialog.Close asChild>{target => target('button', { class: `${styles.Button} green`, children: 'Save changes' })}</Dialog.Close>
        </div>
        <Dialog.Close asChild>{target => target('button', { class: styles.IconButton, 'aria-label': 'Close', children: <Cross2Icon /> })}</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
