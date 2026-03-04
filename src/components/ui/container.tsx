import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  fluid?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Component = "div", fluid = false, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          !fluid && "max-w-7xl",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)
Container.displayName = "Container"

export { Container }
