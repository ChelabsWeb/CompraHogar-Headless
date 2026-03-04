import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border pl-11 pr-4 py-3 text-sm flex flex-col justify-center [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: 
          "border-emerald-500/50 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-500/10 [&>svg]:text-emerald-600",
        warning:
          "border-amber-500/50 text-amber-600 bg-amber-50/50 dark:bg-amber-500/10 [&>svg]:text-amber-600",
        info:
          "border-blue-500/50 text-blue-600 bg-blue-50/50 dark:bg-blue-500/10 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight pl-7", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed pl-7", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
