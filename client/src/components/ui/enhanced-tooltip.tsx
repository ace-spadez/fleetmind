import * as React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type EnhancedTooltipProps = React.ComponentPropsWithoutRef<typeof Tooltip> & {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  children?: React.ReactNode;
};

const EnhancedTooltip = ({
  trigger,
  title,
  description,
  icon,
  side = "right",
  children,
  ...props
}: EnhancedTooltipProps) => {
  return (
    <Tooltip {...props}>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={5}
        className="flex flex-col bg-[#303135] text-white border-gray-700 shadow-md p-0 rounded-md w-72 overflow-hidden"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50">
          {icon && <div className="text-blue-400">{icon}</div>}
          <span className="text-base font-medium">{title}</span>
        </div>
        {description && (
          <div className="px-4 py-3 text-sm text-gray-300">{description}</div>
        )}
        {children}
      </TooltipContent>
    </Tooltip>
  );
};

export { EnhancedTooltip };