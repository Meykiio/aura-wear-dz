import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-aura-violet disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-aura-violet text-white hover:bg-aura-violet-dim",
        destructive: "bg-aura-error text-white hover:bg-aura-error/90",
        outline:
          "border border-aura-border bg-aura-surface hover:bg-aura-surface-2 hover:text-aura-text",
        secondary: "bg-aura-surface-2 text-aura-text hover:bg-aura-surface",
        ghost: "hover:bg-aura-surface-2 hover:text-aura-text",
        link: "text-aura-violet-text underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ref,
  ...props
}: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
};
Button.displayName = "Button";

export { Button, buttonVariants };
