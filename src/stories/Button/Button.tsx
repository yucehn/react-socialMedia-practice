import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-block cursor-pointer border-0 rounded-[3em] font-bold leading-none hover:opacity-80",
  {
    variants: {
      variant: {
        primary: "bg-[#555ab9] text-white",
        secondary:
          "shadow-[rgba(0,0,0,0.15)_0px_0px_0px_1px_inset] bg-transparent text-[#333] border border-[#333]",
      },
      size: {
        small: "py-[10px] px-4 text-xs",
        medium: "py-[11px] px-5 text-sm",
        large: "py-3 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "medium",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  primary?: boolean;
  backgroundColor?: string;
  label: string;
}

export const Button = ({
  primary = false,
  size,
  backgroundColor,
  label,
  className,
  style,
  ...props
}: ButtonProps) => (
  <button
    type="button"
    className={cn(
      buttonVariants({ variant: primary ? "primary" : "secondary", size }),
      className,
    )}
    style={{ backgroundColor, ...style }}
    {...props}
  >
    {label}
  </button>
);
