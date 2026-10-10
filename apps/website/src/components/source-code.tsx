import { CodeBlock } from './code-block.js';

export function SourceCode(props: { code: string; language?: string; meta?: string }) {
  return <CodeBlock.Root class="source-code" my="5"><CodeBlock.Content><CodeBlock.Pre><CodeBlock.Code language={props.language} lines={/\bline=(?:"([^"]*)"|([^\s]+))/.exec(props.meta ?? '')?.slice(1).find(Boolean)}>{props.code}</CodeBlock.Code></CodeBlock.Pre><CodeBlock.CopyButton /></CodeBlock.Content></CodeBlock.Root>;
}
