"use client"

import * as React from "react"
import Link from "next/link"
import { LucideIcon, Drill, Zap, Droplet, Paintbrush, Home, ShieldCheck, Truck, CreditCard, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  Drill,
  Zap,
  Droplet,
  Paintbrush,
  Home,
  ShieldCheck,
  Truck,
  CreditCard,
  Plus
}

export interface CategoryShortcutProps {
  label: string
  href: string
  icon: string
}

export function CategoryShortcutItem({ label, href, icon: iconName }: CategoryShortcutProps) {
  const Icon = iconMap[iconName]
  const isEmoji = !Icon

  return (
    <Link 
      href={href} 
      className="group flex flex-col items-center gap-2 sm:gap-4 transition-opacity hover:opacity-80 snap-center shrink-0 w-[72px] sm:w-auto"
    >
      <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-md">
        {isEmoji ? (
          <span className="text-3xl sm:text-4xl drop-shadow-sm">{iconName}</span>
        ) : (
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#21645d]" strokeWidth={1.5} />
        )}
      </div>
      <span className="text-center text-[12px] sm:text-[14px] leading-tight font-semibold text-slate-700 transition-colors group-hover:text-[#21645d]">
        {label}
      </span>
    </Link>
  )
}

export interface CategoryShortcutsListProps {
  categories: CategoryShortcutProps[]
  className?: string
}

export function CategoryShortcutsList({ categories, className }: CategoryShortcutsListProps) {
  return (
    <div className={cn("w-full overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar py-4", className)}>
      <div className="flex w-max items-start gap-4 sm:gap-6 md:gap-12 px-4 mx-auto md:mx-0">
        {categories.map((category) => (
          <CategoryShortcutItem
            key={category.label}
            label={category.label}
            href={category.href}
            icon={category.icon}
          />
        ))}
      </div>
    </div>
  )
}
