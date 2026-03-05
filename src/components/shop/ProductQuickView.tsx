"use client"

import * as React from "react"
import { Eye } from "lucide-react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { ProductView } from "@/components/shop/ProductView"

export interface ProductQuickViewProps {
  product: any // We expect the Shopify Product node here
  triggerText?: string
  triggerIcon?: boolean
}

export function ProductQuickView({ product, triggerText = "Vista Rápida", triggerIcon = true }: ProductQuickViewProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  if (!product) return null

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="w-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] shadow-lg border border-slate-200 text-slate-800 hover:bg-white hover:text-primary"
        onClick={(e) => {
          e.preventDefault() // prevent navigating if inside a Link
          setIsOpen(true)
        }}
      >
        {triggerIcon && <Eye className="mr-2 h-4 w-4" />}
        {triggerText}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="max-w-5xl p-0 overflow-hidden bg-transparent shadow-2xl border-none"
      >
        {/* We reuse the actual ProductView inside a Modal! */}
        <div className="rounded-3xl relative bg-white w-full">
          <ProductView product={product} isQuickView={true} onClose={() => setIsOpen(false)} />
        </div>
      </Modal>
    </>
  )
}
