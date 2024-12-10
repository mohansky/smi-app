"use client";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import React from "react";

const containerVariants = cva(" ", {
  variants: {
    variant: {
      default: "p-1",
      light: "text-black bg-white",
      dark: "text-white bg-black",
    },
    width: {
      marginxy:
        "sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-2 md:px-0 mx-auto my-28",
      marginx:
        "sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl px-2 md:px-0 mx-auto",
      marginy: "w-full my-28",
      nomargin: "w-full",
    },
    animate: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    width: "marginxy",
    animate: true,
  },
});

export interface ContainerProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      className,
      variant,
      width,
      animate = true,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    const internalRef = useRef(null);
    const isInView = useInView(internalRef, { once: true });

    const content = animate ? (
      <div
        style={{
          // transform: isInView ? "none" : "translateY(200px)",
          opacity: isInView ? 1 : 0,
          transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
        }}
        ref={ref}
      >
        {children}
      </div>
    ) : (
      children
    );

    return (
      <Comp
        className={cn(
          containerVariants({ variant, width, animate, className })
        )}
        ref={internalRef}
        {...props}
      >
        {content}
      </Comp>
    );
  }
);

Container.displayName = "Container";

export { Container, containerVariants };
