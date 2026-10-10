import { createUniqueId } from 'solid-js';
import { Dialog } from '@radix-solid/primitives';
import { Cross2Icon } from '@radix-solid/icons';
import './styles.css';

export default function DialogDemo() {
  const name = createUniqueId();
  const username = createUniqueId();
  return <Dialog.Root>
    <Dialog.Trigger asChild>{target => target('button', { class: "inline-flex h-[35px] items-center justify-center rounded bg-violet4 px-[15px] font-medium leading-none text-violet11 outline-none outline-offset-1 hover:bg-mauve3 focus-visible:outline-2 focus-visible:outline-violet6 select-none", children: 'Edit profile' })}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay class={"fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow"} />
      <Dialog.Content class={"fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow"}>
        <Dialog.Title class={"m-0 text-[17px] font-medium text-mauve12"}>Edit profile</Dialog.Title>
        <Dialog.Description class={"mb-5 mt-2.5 text-[15px] leading-normal text-mauve11"}>Make changes to your profile here. Click save when you're done.</Dialog.Description>
        <fieldset class={"mb-[15px] flex items-center gap-5"}><label class={"w-[90px] text-right text-[15px] text-violet11"} for={name}>Name</label><input class={"inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"} id={name} value="Pedro Duarte" /></fieldset>
        <fieldset class={"mb-[15px] flex items-center gap-5"}><label class={"w-[90px] text-right text-[15px] text-violet11"} for={username}>Username</label><input class={"inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"} id={username} value="@peduarte" /></fieldset>
        <div class="mt-[25px] flex justify-end">
          <Dialog.Close asChild>{target => target('button', { class: "inline-flex h-[35px] items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-green12 outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none", children: 'Save changes' })}</Dialog.Close>
        </div>
        <Dialog.Close asChild>{target => target('button', { class: "absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none", 'aria-label': 'Close', children: <Cross2Icon /> })}</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
