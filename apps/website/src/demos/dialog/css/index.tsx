import { createUniqueId } from 'solid-js';
import { Dialog } from '@radix-solid/primitives';
import { Cross2Icon } from '@radix-solid/icons';
import './styles.css';

export default function DialogDemo() {
  const name = createUniqueId();
  const username = createUniqueId();
  return <Dialog.Root>
    <Dialog.Trigger asChild>{target => target('button', { class: "Button violet", children: 'Edit profile' })}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay class={"DialogOverlay"} />
      <Dialog.Content class={"DialogContent"}>
        <Dialog.Title class={"DialogTitle"}>Edit profile</Dialog.Title>
        <Dialog.Description class={"DialogDescription"}>Make changes to your profile here. Click save when you're done.</Dialog.Description>
        <fieldset class={"Fieldset"}><label class={"Label"} for={name}>Name</label><input class={"Input"} id={name} value="Pedro Duarte" /></fieldset>
        <fieldset class={"Fieldset"}><label class={"Label"} for={username}>Username</label><input class={"Input"} id={username} value="@peduarte" /></fieldset>
        <div style={{ display: 'flex', 'margin-top': '25px', 'justify-content': 'flex-end' }}>
          <Dialog.Close asChild>{target => target('button', { class: "Button green", children: 'Save changes' })}</Dialog.Close>
        </div>
        <Dialog.Close asChild>{target => target('button', { class: "IconButton", 'aria-label': 'Close', children: <Cross2Icon /> })}</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
