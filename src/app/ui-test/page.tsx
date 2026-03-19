"use client"

import React, { useState, Suspense } from "react"
import { ShoppingCart, Mail, AlertCircle, Trash2, Send, Check, Drill, Home, Zap, Droplet, Paintbrush, Plus, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { Drawer } from "@/components/ui/drawer"
import { ToastProvider, useToast } from "@/components/ui/toast"
import { Container } from "@/components/ui/container"
import { SearchBar } from "@/components/ui/search-bar"
import { Toggle } from "@/components/ui/toggle"
import { Accordion } from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryShortcutsList } from "@/components/shop/CategoryShortcuts"
import { FilterSection, FilterItem, PriceRangeFilter } from "@/components/shop/SidebarFilter"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"

export default function UITestPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">Página no disponible.</p>
      </div>
    );
  }

  const OriginalContent = UITestPageContent;
  return <OriginalContent />;
}

function UITestPageContent() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <Suspense fallback={<div>Cargando UI...</div>}>
          <UITestContent />
        </Suspense>
      </ToastProvider>
    </TooltipProvider>
  )
}

function UITestContent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { toast } = useToast()

  const sampleCategories = [
    { label: "Herramientas", href: "#", icon: "🛠️" },
    { label: "Obra Gruesa", href: "#", icon: "🧱" },
    { label: "Iluminación", href: "#", icon: "💡" },
    { label: "Sanitaria", href: "#", icon: "🚿" },
    { label: "Servicios B2B", href: "#", icon: "👷" },
    { label: "Ver Todas", href: "#", icon: "✨" },
  ]

  return (
    <Container className="py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">UI Component Library</h1>
        <p className="text-muted-foreground text-lg">
          CompraHogar Premium Headless E-commerce - Base Components
        </p>
      </div>

      {/* Category Shortcuts Section */}
      <section className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Category Shortcuts</h2>
        </div>
        <div className="bg-slate-50 py-8 rounded-xl border border-slate-100">
           <CategoryShortcutsList categories={sampleCategories} />
        </div>
      </section>

      {/* Buttons Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Buttons</h2>
          </div>
          <div className="grid gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Variants</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="default">Default Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Option</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sizes & States</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small (sm)</Button>
                <Button size="default">Default (md)</Button>
                <Button size="lg">Large Premium (lg)</Button>
                <Button size="icon" variant="outline"><ShoppingCart /></Button>
                <Button isLoading={true}>Modo Carga</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">With Icons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button><ShoppingCart className="mr-2" /> Add to Cart</Button>
                <Button variant="outline">Email us <Mail className="ml-2" /></Button>
              </div>
            </div>
          </div>
        </section>

        {/* Inputs Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Inputs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Input</label>
              <Input placeholder="Enter your name..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">With Left Icon</label>
              <Input placeholder="Email address" type="email" iconLeft={<Mail className="h-4 w-4" />} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">With Right Icon</label>
              <Input placeholder="Search products..." iconRight={<ShoppingCart className="h-4 w-4" />} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Error State</label>
              <Input 
                placeholder="Password" 
                type="password" 
                defaultValue="secret"
                error="Password must be at least 8 characters long." 
                iconLeft={<AlertCircle className="h-4 w-4 text-destructive" />}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Disabled Input</label>
              <Input placeholder="You cannot type here" disabled />
            </div>
          </div>
        </section>

        {/* Textarea Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Textarea component</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <div className="space-y-2">
              <label className="text-sm font-medium">Empty Textarea</label>
              <Textarea placeholder="Escribe un mensaje..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Disabled Textarea</label>
              <Textarea placeholder="Escribe un mensaje..." disabled />
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Badges & Tags</h2>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Badge variant="default">New Arrival</Badge>
            <Badge variant="secondary">Draft</Badge>
            <Badge variant="outline">Category</Badge>
            <Badge variant="destructive">Sold Out</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Low Stock</Badge>
          </div>
        </section>

        {/* Tooltip Component Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Tooltip component</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Políticas de envío</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Ayuda sobre políticas de envío</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Información adicional sobre políticas de envío</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </section>

        {/* Overlays Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Overlays & Alerts</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Open Modal / Dialog
            </Button>
            
            <Button variant="outline" onClick={() => setIsDrawerOpen(true)}>
              Open Drawer (Cart)
            </Button>
          </div>
        </section>

        {/* Toasts Section */}
        <section className="space-y-4">
          <div className="border-b pb-2">
            <h2 className="text-2xl font-semibold tracking-tight">Toasts (Notifications)</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="outline"
              onClick={() => toast({ title: "Acción completada", description: "Tu perfil ha sido actualizado. "})}
            >
              Default Toast
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => toast({ title: "Producto Agregado", description: "El sofá se añadió a tu carrito", variant: "success"})}
            >
              <Check className="mr-2" /> Success Toast
            </Button>
            <Button 
              variant="destructive"
              onClick={() => toast({ title: "Error al procesar", description: "Tu tarjeta ha sido rechazada.", variant: "error"})}
            >
              <AlertCircle className="mr-2" /> Error Toast
            </Button>
            <Button 
              variant="secondary"
              onClick={() => toast({ title: "Nueva actualización", description: "Hay nuevas ofertas disponibles.", variant: "info"})}
            >
              Info Toast
            </Button>
          </div>
        </section>
      <SearchAndFiltersDemo />

      {/* Renders Overlays */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Delete Item"
        description="Are you sure you want to delete 'Sillón Premium'? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => setIsModalOpen(false)}><Trash2 className="mr-2" /> Delete</Button>
        </div>
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Shopping Cart"
        side="right"
      >
        <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 -mx-6 px-6 py-4">
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <ShoppingCart className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm">Looks like you haven&apos;t added anything yet.</p>
          </div>
          <div className="mt-auto pt-6 border-t font-medium">
            <Button className="w-full" size="lg" onClick={() => setIsDrawerOpen(false)}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </Drawer>

    </Container>
  )
}

function SearchAndFiltersDemo() {
  const [searchLoading, setSearchLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState("all")
  const [quantity, setQuantity] = useState(1)
  const [showFullShipping, setShowFullShipping] = useState(false)

  return (
    <>
      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Navigation & Breadcrumbs</h2>
        </div>
        <div className="flex flex-col gap-4">
          <Breadcrumbs 
            items={[
              { label: "Catálogo", href: "#" },
              { label: "Herramientas", href: "#" },
              { label: "Taladros" }
            ]}
          />
        </div>
      </section>

      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Search & Filtering</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* SearchBar */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Search Bar (Debounced)</h3>
            <SearchBar 
              placeholder="Buscar productos, marcas..." 
              isLoading={searchLoading}
              onChange={(q) => {
                setSearchLoading(true)
                setTimeout(() => setSearchLoading(false), 800)
              }}
            />
          </div>

          {/* Select Component */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Select Box</h3>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4">
               <Select defaultValue="relevant">
                 <SelectTrigger className="w-full text-slate-800 border-slate-200">
                   <SelectValue placeholder="Ordenar por" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="relevant">Más relevantes</SelectItem>
                   <SelectItem value="price-asc">Menor precio</SelectItem>
                   <SelectItem value="price-desc">Mayor precio</SelectItem>
                 </SelectContent>
               </Select>
               <Select disabled defaultValue="empty">
                 <SelectTrigger className="w-full text-slate-800 border-slate-200">
                   <SelectValue placeholder="Sin stock" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="empty">Sin stock</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Quantity (Stepper)</h3>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4 items-start">
               <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
               <p className="text-xs text-slate-500">Stock limit: 10</p>
            </div>
          </div>

          {/* Toggle / Filter chips */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Filter Chips (Toggle)</h3>
            <div className="flex flex-wrap gap-2">
              <Toggle variant="chip" pressed={activeFilter === "all"} onPressedChange={() => setActiveFilter("all")}>
                Todos
              </Toggle>
              <Toggle variant="chip" pressed={activeFilter === "sale"} onPressedChange={() => setActiveFilter("sale")}>
                Solo Ofertas
              </Toggle>
              <Toggle variant="chip" pressed={activeFilter === "new"} onPressedChange={() => setActiveFilter("new")}>
                Nuevos Ingresos
              </Toggle>
            </div>
          </div>

          {/* Checkboxes & Radios */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Checkboxes & Radios</h3>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-6">
               <div className="space-y-3">
                 <div className="flex items-center space-x-2">
                   <Checkbox id="terms" defaultChecked />
                   <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                     Acepto los términos y condiciones
                   </label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox id="disabled-check" disabled />
                   <label htmlFor="disabled-check" className="text-sm text-slate-500 leading-none">
                     Opción deshabilitada
                   </label>
                 </div>
               </div>

               <div className="space-y-3 pt-2 border-t border-slate-100">
                 <div className="flex items-center space-x-2">
                   <Radio id="r1" name="shipping" value="default" defaultChecked />
                   <label htmlFor="r1" className="text-sm font-medium leading-none">
                     Envío normal (72hs)
                   </label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Radio id="r2" name="shipping" value="express" />
                   <label htmlFor="r2" className="text-sm font-medium leading-none">
                     Llega gratis mañana
                   </label>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Alerts & Banners */}
        <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
             <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Alerts & Banners</h3>
             <div className="space-y-4">
                <Alert variant="success">
                  <Check className="h-4 w-4" />
                  <AlertTitle>¡Compra exitosa!</AlertTitle>
                  <AlertDescription>
                    Tu pago ha sido procesado y el pedido está en preparación.
                  </AlertDescription>
                </Alert>

                <Alert variant="warning">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Queda poco stock</AlertTitle>
                  <AlertDescription>
                    Solo quedan 2 unidades disponibles a este precio.
                  </AlertDescription>
                </Alert>

                <Alert variant="info">
                  <Mail className="h-4 w-4" />
                  <AlertTitle>Nuevo mensaje</AlertTitle>
                  <AlertDescription>
                    El vendedor ha respondido a tu pregunta sobre el producto.
                  </AlertDescription>
                </Alert>
             </div>
           </div>
        </div>
      </section>
      
      {/* Accordion & Skeletons */}
      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Accordion & Loading States</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Accordion (FAQ / Specs)</h3>
            <Accordion 
              items={[
                { id: "1", title: "¿Hacen envíos al interior?", content: "Sí, enviamos a todo el país a través de DAC y Mirtrans con seguro incluido." },
                { id: "2", title: "Políticas de Devolución", content: "Tienes 30 días calendario para realizar cambios presentando el ticket de compra y el producto en perfecto estado." }
              ]}
              className="bg-white border rounded-lg px-4 shadow-sm"
            />

            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-8">Tabs</h3>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <Tabs defaultValue="desc">
                <TabsList className="mb-4">
                  <TabsTrigger value="desc">Descripción</TabsTrigger>
                  <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                </TabsList>
                <TabsContent value="desc">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Excelente taladro percutor de 20v con doble batería de litio. Ideal para trabajos de mampostería y madera.
                  </p>
                </TabsContent>
                <TabsContent value="specs">
                  <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
                    <li>Potencia: 20V Max</li>
                    <li>Velocidad sin carga: 0-1500 RPM</li>
                    <li>Impactos por minuto: 0-25500 IPM</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Skeletons (Loading)</h3>
            <div className="flex gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2 flex-1 pt-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Collection Layout Demo */}
      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Store Collection Layout</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Sidebar */}
          <div className="col-span-1 hidden md:block">
            <FilterSection title="Categorías">
              <FilterItem label="Herramientas" count={24} isActive />
              <FilterItem label="Obra Gruesa" count={8} />
              <FilterItem label="Iluminación" count={3} />
            </FilterSection>

            <FilterSection title="Precio">
              <FilterItem label="Hasta $ 2.500" />
              <FilterItem label="$ 2.500 a $ 10.000" />
              <FilterItem label="Más de $ 10.000" />
              <PriceRangeFilter />
            </FilterSection>

            <FilterSection title="Condición">
              <FilterItem label="Nuevo" count={0} />
              <FilterItem label="Reacondicionado" count={2} />
            </FilterSection>
          </div>

          {/* Product Grid */}
          <div className="col-span-1 md:col-span-3">
             <ProductGrid products={[
                {
                  node: {
                    id: "gid://shopify/Product/mock-1",
                    handle: "taladro-mock",
                    title: "Taladro Atornillador Inalámbrico 20v",
                    priceRange: { minVariantPrice: { amount: "3500", currencyCode: "UYU" } },
                    featuredImage: null // Will fallback to "CH" placeholder
                  }
                },
                {
                  node: {
                    id: "gid://shopify/Product/mock-2",
                    handle: "pintura-mock",
                    title: "Pintura Interior Lavable 4L Blanca Premium",
                    priceRange: { minVariantPrice: { amount: "1200", currencyCode: "UYU" } },
                    featuredImage: null
                  }
                },
                {
                  node: {
                    id: "gid://shopify/Product/mock-3",
                    handle: "sillon-mock",
                    title: "Sillón de 3 Cuerpos Tela Antimanchas",
                    priceRange: { minVariantPrice: { amount: "18500", currencyCode: "UYU" } },
                    featuredImage: null
                  }
                }
             ]} />
          </div>
        </div>
      </section>

      {/* Pagination component */}
      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Pagination component</h2>
        </div>
        <div className="bg-white py-8 rounded-xl border border-slate-100 shadow-sm">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* Progress component */}
      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Progress component</h2>
        </div>
        <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Ejemplo 1 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium text-slate-800">Te faltan $500 para envío gratis</span>
                <span className="font-bold text-[#f3843e]">85%</span>
              </div>
              <Progress value={85} />
            </div>

            {/* Ejemplo 2 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="font-medium text-slate-800">Completando tu perfil...</span>
                <span className="font-bold text-slate-500">33%</span>
              </div>
              <Progress value={33} />
            </div>
          </div>
        </div>
      </section>

      {/* Switch Component */}
      <section className="space-y-4 pt-12">
        <div className="border-b pb-2">
          <h2 className="text-2xl font-semibold tracking-tight">Switch Component</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-sm">
          <div className="flex items-center space-x-3">
             <Switch 
               id="full-shipping" 
               checked={showFullShipping} 
               onCheckedChange={setShowFullShipping} 
             />
             <label 
               htmlFor="full-shipping" 
               className="text-sm font-medium leading-none cursor-pointer"
             >
               Mostrar envío Full
             </label>
          </div>
          <p className="mt-4 text-sm text-slate-500">
             Estado actual: <span className="font-semibold text-slate-700">{showFullShipping ? 'Activado' : 'Desactivado'}</span>
          </p>
        </div>
      </section>
    </>
  )
}
