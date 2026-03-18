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
      className="group flex flex-col items-center gap-2 sm:gap-4 transition-all duration-300 hover:opacity-100 snap-center shrink-0 w-[76px] sm:w-auto lg:flex-1"
    >
      <div className="flex h-[72px] w-[72px] sm:h-24 sm:w-24 lg:h-28 lg:w-28 shrink-0 items-center justify-center rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-slate-100/80 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] group-hover:-translate-y-1 relative overflow-hidden">
        {/* Subtle highlight effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isEmoji ? (
          <span className="text-[32px] sm:text-[44px] drop-shadow-sm relative z-10 transition-transform duration-300 group-hover:scale-110">{iconName}</span>
        ) : (
          <Icon className="h-7 w-7 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        )}
      </div>
      <span className="text-center text-[13px] sm:text-[15px] lg:text-base leading-tight font-medium text-slate-700 transition-colors group-hover:text-primary tracking-wide">
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
    <div className={cn("w-full overflow-x-auto snap-x snap-mandatory scroll-p-4 no-scrollbar py-4 lg:overflow-x-visible lg:snap-none", className)}>
      <div className="flex w-max items-start gap-4 sm:gap-6 md:gap-12 px-4 mx-auto md:mx-0 lg:w-full lg:justify-between lg:px-0">
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
