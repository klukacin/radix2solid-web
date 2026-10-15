import { FolderIcon } from "@wsagency/radix2solid-icons-extra";
import FolderOpenIcon from "@wsagency/radix2solid-icons-extra/FolderOpenIcon";
import "./styles.css";

export default function IconsExtraDemo() {
  return <div class={"ExtraDemo"}>
    <span class={"ExtraRow"}><FolderIcon /> Decorative folder at the default 15px</span>
    <span class={"ExtraRow"}><FolderOpenIcon title="Open project folder" size={24} color="var(--accent-9, #6e56cf)" /> Named open folder at 24px</span>
    <p>Two extra icons, separate from the original 332. Both use a 24×24 viewBox.</p>
  </div>;
}
