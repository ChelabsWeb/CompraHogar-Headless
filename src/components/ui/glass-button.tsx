import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * GlassButton — pill premium con glassmorphism + gradient border.
 *
 * Inspirado en el button "gradient" de DentAgenda (`@/shared/ui/button.tsx`)
 * combinado con el patrón glass de su LandingNav/LandingHero.
 *
 * Reglas (alineadas con DentAgenda):
 *   ✅ CTA primario clave, hero, modal crítico, exit intent, newsletter, auth.
 *   ❌ Inputs idle, sidebar nav, listados, repetidos >2 veces visibles a la vez.
 *   📐 Máximo 1-2 instancias visibles por pantalla.
 *
 * Variantes:
 *   - `light` — sobre bg claro (cards, popups, light sections). bg-white/70 + blur-md
 *   - `dark`  — sobre bg oscuro/colorido (hero, banners teal). bg-white/15 + blur-xl
 *
 * Uso:
 *   <GlassButton variant="dark" size="lg" asChild>
 *     <Link href="/x">Click</Link>
 *   </GlassButton>
 */
const glassButtonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "gradient-border gradient-border-to-t rounded-full",
    "font-semibold",
    "transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
    "hover:brightness-105 active:scale-95",
    "disabled:opacity-50 disabled:pointer-events-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
  ),
  {
    variants: {
      variant: {
        light: cn(
          "gradient-border-from-white gradient-border-to-neutral-200",
          "bg-white/70 backdrop-blur-md backdrop-saturate-150",
          "text-neutral-900",
          "shadow-[0_4px_16px_-4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.6)]",
          "hover:bg-white/90"
        ),
        dark: cn(
          "gradient-border-from-white/60 gradient-border-to-white/15",
          "bg-white/15 backdrop-blur-xl backdrop-saturate-150",
          "text-white",
          "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:bg-white/25"
        ),
      },
      size: {
        sm: "px-3 py-1.5 text-[12px] lg:text-[13px] gap-1.5",
        md: "px-5 py-2.5 text-sm",
        lg: "px-6 py-3 sm:px-7 sm:py-3.5 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg",
      },
    },
    defaultVariants: {
      variant: "light",
      size: "md",
    },
  }
)

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  asChild?: boolean
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button"
    return (
      <Comp
        ref={ref as React.Ref<any>}
        className={cn(glassButtonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
GlassButton.displayName = "GlassButton"

export { GlassButton, glassButtonVariants }
