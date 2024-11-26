import { CopyButton as Cb, ActionIcon, Tooltip, } from '@mantine/core';
import { Copy as IconCopy, Check as IconCheck } from '@phosphor-icons/react';

export default function CopyButton({value}) {
  return (
    <Cb value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
          <ActionIcon  color={copied ? 'teal' : 'gray'} p={0} variant="transparent" onClick={copy}>
            {copied ? (
              <IconCheck size={16} color='blue' />
            ) : (
              <IconCopy  size={16} color='blue' />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </Cb>
  );
}