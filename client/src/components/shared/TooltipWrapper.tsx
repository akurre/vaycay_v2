import { Tooltip } from '@mantine/core';
import { ReactNode } from 'react';

interface TooltipWrapperProps {
  children: ReactNode;
  label: string;
}

const TooltipWrapper = ({ children, label }: TooltipWrapperProps) => {
  return (
    <Tooltip label={label} withArrow>
      <div className="inline-flex">{children}</div>
    </Tooltip>
  );
};

export default TooltipWrapper;
