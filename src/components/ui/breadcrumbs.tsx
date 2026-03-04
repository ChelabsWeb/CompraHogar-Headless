import * as React from "react"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbItemProps {
  label: string
  href?: string
  isLast?: boolean
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItemProps[]
  separator?: React.ReactNode
}

export function Breadcrumbs({
  items,
  separator = <ChevronRight className="h-4 w-4 text-slate-400" />,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm text-slate-500", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1 || item.isLast

          return (
            <React.Fragment key={index}>
              <li>{separator}</li>
              <li>
                {isLast || !item.href ? (
                  <span
                    className="font-medium text-slate-900"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-slate-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
