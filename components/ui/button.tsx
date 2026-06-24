import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink px-7 py-4 text-bg shadow-none hover:-translate-y-px hover:bg-[#2c2c2a]",
        glass:
          "border border-line bg-white/75 px-6 py-3 text-ink shadow-glass backdrop-blur-md hover:-translate-y-px hover:border-teal/70 hover:bg-white",
        outline: "border border-line bg-white/55 px-5 py-3 text-ink hover:border-teal/70",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
