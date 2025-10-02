import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-2xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p1: "text-base font-regular",
      p2: "text-sm leading-6",
      p3: "text-xs leading-5",
      muted: "text-sm text-muted-foreground",
      lead: "text-xl text-muted-foreground",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    font: {
      default: "font-poppins",
    }
  },
  defaultVariants: {
    variant: "p1",
    weight: "regular",
    font: "default",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(({ 
  className, 
  variant, 
  weight, 
  font, 
  as, 
  ...props 
}, ref) => {
  // Automatically map variants to semantic HTML elements unless overridden by 'as' prop
  const getElement = (): keyof JSX.IntrinsicElements => {
    if (as) return as;
    if (!variant) return "p";
    
    // Map heading variants to heading elements
    if (variant.startsWith("h") && variant.length === 2) {
      return variant as keyof JSX.IntrinsicElements;
    }
    
    // Map paragraph variants to p elements
    if (variant.startsWith("p") || variant === "muted" || variant === "lead") {
      return "p";
    }
    
    return "p";
  };

  const Comp = getElement();
  return React.createElement(
    Comp,
    {
      ref,
      className: cn(typographyVariants({ variant, weight, font, className })),
      ...props,
    }
  );
});

Typography.displayName = "Typography";

export { Typography, typographyVariants };
