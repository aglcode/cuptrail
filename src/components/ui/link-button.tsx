"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { Button, type buttonVariants } from "./button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function LinkButton({
  className,
  variant,
  children,
  ...props
}: ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Button
      nativeButton={false}
      render={<Link {...props} />}
      variant={variant}
      className={cn("h-auto min-h-11 whitespace-normal", className)}
    >
      {children}
    </Button>
  );
}
