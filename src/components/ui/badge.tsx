import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        critical: "border-transparent bg-red-500 text-white hover:bg-red-600",
        important: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        minor: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        formatting: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        keywords: "border-transparent bg-green-500 text-white hover:bg-green-600",
        atsCompatibility: "border-transparent bg-red-500 text-white hover:bg-red-600",
        contactInfo: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        experience: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
        skills: "border-transparent bg-teal-500 text-white hover:bg-teal-600",
        education: "border-transparent bg-indigo-500 text-white hover:bg-indigo-600",
        achievements: "border-transparent bg-pink-500 text-white hover:bg-pink-600",
        contentQuality: "border-transparent bg-cyan-500 text-white hover:bg-cyan-600",
        jobMatch: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
        grammar: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
        other: "border-transparent bg-gray-500 text-white hover:bg-gray-600",
      },
      size: {
        default: "h-6 px-2.5 py-0.5 text-xs",
        sm: "h-5 px-1.5 py-0 text-xs",
        lg: "h-7 px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
