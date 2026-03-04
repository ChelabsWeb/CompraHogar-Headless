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
  const Icon = iconMap[iconName] || Home;
  return (
    <Link 
      href={href} 
      className="group flex flex-col items-center gap-3 transition-opacity hover:opacity-80"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-md">
        <Icon className="h-7 w-7 text-[#21645d]" strokeWidth={1.5} />
      </div>
      <span className="text-center text-[13px] font-medium text-slate-600 transition-colors group-hover:text-[#21645d]">
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
    <div className={cn("w-full overflow-x-auto no-scrollbar py-4", className)}>
      <div className="flex min-w-max items-start justify-between gap-6 sm:justify-center md:gap-12 px-4">
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
