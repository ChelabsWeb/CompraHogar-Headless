"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Drawer } from "vaul";
import { ChevronRight, ChevronLeft, X, Menu, Package, ShoppingBag, UserCircle } from "lucide-react";
import Link from "next/link";
import {
  COLLECTION_HIERARCHY,
  MAIN_COLLECTION_HANDLES,
  getCollectionIcon,
} from "@/lib/constants/collectionHierarchy";
import { MobileMenuProfileHeader } from "@/components/layout/MobileMenuProfileHeader";

type Category = {
  id: string;
  name: string;
  href?: string;
  handle?: string;
  children?: Category[];
};

interface MobileMenuProps {
  collections?: any[];
  /**
   * Optional controlled open state. If provided, MobileMenu becomes controlled
   * and ignores its own Trigger button. Used by EdgeSwipeOpener (next task)
   * to open the drawer in response to a global gesture.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function MobileMenu({
  collections = [],
  open,
  onOpenChange,
}: MobileMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? (open as boolean) : uncontrolledOpen;
  const setIsOpen = (next: boolean) => {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setUncontrolledOpen(next);
    }
  };

  // ---- Categories: same dynamic mapping as before ----
  const categories: Category[] = useMemo(() => {
    if (!collections || collections.length === 0) return [];
    const finalCategories: Category[] = [];

    MAIN_COLLECTION_HANDLES.forEach((handle) => {
      const mainCol = collections.find(
        (c) => c.handle === handle || c.handle === handle.split("-")[0]
      );
      if (mainCol) {
        const expectedSubs = COLLECTION_HIERARCHY[handle] || [];
        // Only include sub-categories that actually exist as Shopify collections.
        // Otherwise the link would navigate to a blank /collections/<handle> page.
        const foundSubs = expectedSubs
          .map((sub) => {
            const foundCol = collections.find((c) => c.handle === sub.handle);
            if (!foundCol) return null;
            return {
              id: foundCol.id || foundCol.handle,
              name: foundCol.title || sub.name,
              href: `/collections/${foundCol.handle}`,
              handle: foundCol.handle,
            };
          })
          .filter((s): s is NonNullable<typeof s> => s !== null);

        finalCategories.push({
          id: mainCol.id || mainCol.handle,
          name: mainCol.title,
          href: `/collections/${mainCol.handle}`,
          handle,
          children: foundSubs.length > 0 ? foundSubs : undefined,
        });
      }
    });

    return finalCategories;
  }, [collections]);

  // ---- Drill-down state ----
  // `drilledStack` holds only the views below root. Root is derived from `categories`
  // so we never need an effect to sync it (avoids react-hooks/set-state-in-effect).
  const [drilledStack, setDrilledStack] = useState<
    { id: string; name: string; items: Category[]; href?: string }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const rootView = useMemo(
    () => ({ id: "root", name: "Inicio", items: categories, href: undefined as string | undefined }),
    [categories]
  );

  const views = useMemo(
    () => [rootView, ...drilledStack],
    [rootView, drilledStack]
  );

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setActiveIndex(0);
        setDrilledStack([]);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handlePush = (category: Category) => {
    if (category.children && category.children.length > 0) {
      const newView = {
        id: category.id,
        name: category.name,
        items: category.children,
        href: category.href,
      };
      // Truncate any "future" drilled views (in case user navigated back then forward).
      // activeIndex=0 means root is visible → push to drilledStack[0].
      // activeIndex=1 means drilledStack[0] is visible → push to drilledStack[1], etc.
      const drilledIndex = activeIndex;
      setDrilledStack((prev) => [...prev.slice(0, drilledIndex), newView]);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePop = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const closeAndGo = () => setIsOpen(false);

  return (
    <Drawer.Root
      direction="left"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      {!isControlled && (
        <Drawer.Trigger asChild>
          <button
            className="p-2 text-gray-700 hover:text-black focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </Drawer.Trigger>
      )}

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />

        <Drawer.Content
          className="fixed bottom-0 left-0 top-0 z-[101] flex h-full w-[85vw] max-w-[320px] flex-col bg-white shadow-2xl outline-none"
        >
          <Drawer.Title className="sr-only">Navegación Móvil</Drawer.Title>
          <Drawer.Description className="sr-only">
            Menú principal de categorías
          </Drawer.Description>

          {/* Right-edge grabber (visual affordance for drag-to-close) */}
          <span
            aria-hidden
            className="absolute top-3 right-2 h-10 w-1 rounded-full bg-slate-300/80 z-10 pointer-events-none"
          />

          <div className="relative flex-1 w-full h-full overflow-hidden bg-white">
            <div
              className="flex h-full w-full transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${activeIndex * 100}%)`,
                width: `${Math.max(1, views.length) * 100}%`,
              }}
            >
              {views.map((view, index) => (
                <div
                  key={`${view.id}-${index}`}
                  className="h-full flex flex-col shrink-0 bg-white"
                  style={{ width: `${100 / Math.max(1, views.length)}%` }}
                  aria-hidden={index !== activeIndex}
                >
                  {index === 0 ? (
                    /* ---------- ROOT VIEW ---------- */
                    <>
                      <MobileMenuProfileHeader onClose={closeAndGo} />

                      <nav className="flex-1 overflow-y-auto overscroll-contain py-1 pb-safe">
                        <ul>
                          {view.items.map((item) => {
                            const Icon = item.handle
                              ? getCollectionIcon(item.handle)
                              : Package;
                            const hasChildren =
                              item.children && item.children.length > 0;
                            const content = (
                              <>
                                <Icon
                                  size={26}
                                  strokeWidth={1.75}
                                  className="text-slate-700 shrink-0"
                                />
                                <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                                  {item.name}
                                </span>
                                {hasChildren && (
                                  <ChevronRight
                                    size={20}
                                    className="ml-auto text-slate-300"
                                  />
                                )}
                              </>
                            );

                            return (
                              <li key={item.id}>
                                {hasChildren ? (
                                  <button
                                    type="button"
                                    onClick={() => handlePush(item)}
                                    className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] text-left active:bg-primary/[0.08] transition-colors"
                                  >
                                    {content}
                                  </button>
                                ) : (
                                  <Link
                                    href={item.href || "#"}
                                    onClick={closeAndGo}
                                    className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                                  >
                                    {content}
                                  </Link>
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        {/* Account section divider */}
                        <div className="h-px bg-slate-100 my-2 mx-4" />
                        <p className="px-5 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
                          Tu cuenta
                        </p>
                        <ul>
                          <li>
                            <Link
                              href="/cuenta/mis-compras"
                              onClick={closeAndGo}
                              className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                            >
                              <ShoppingBag size={26} strokeWidth={1.75} className="text-slate-700" />
                              <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                                Mis pedidos
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/cuenta"
                              onClick={closeAndGo}
                              className="w-full flex items-center gap-4 px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                            >
                              <UserCircle size={26} strokeWidth={1.75} className="text-slate-700" />
                              <span className="text-[17px] font-semibold text-slate-900 tracking-tight">
                                Mi cuenta
                              </span>
                            </Link>
                          </li>
                        </ul>
                      </nav>
                    </>
                  ) : (
                    /* ---------- DRILLED VIEW ---------- */
                    <>
                      <div className="flex items-center justify-between px-3 pt-safe min-h-[56px] border-b border-slate-100 bg-white shrink-0">
                        <button
                          type="button"
                          onClick={handlePop}
                          className="flex items-center text-primary font-semibold text-[15px] active:opacity-60 transition-opacity p-2 rounded-lg"
                        >
                          <ChevronLeft size={20} className="mr-1" />
                          Volver
                        </button>
                        <Drawer.Close asChild>
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 active:scale-95 transition-all"
                            aria-label="Cerrar menú"
                          >
                            <X size={16} strokeWidth={2} />
                          </button>
                        </Drawer.Close>
                      </div>

                      <h2 className="px-5 pt-3 pb-2 text-[22px] font-bold text-slate-900 tracking-tight">
                        {view.name}
                      </h2>

                      <nav className="flex-1 overflow-y-auto overscroll-contain pb-safe">
                        <ul>
                          {view.href && (
                            <li>
                              <Link
                                href={view.href}
                                onClick={closeAndGo}
                                className="w-full flex items-center justify-between px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                              >
                                <span className="text-[16px] font-medium text-slate-700">
                                  Ver todo
                                </span>
                                <ChevronRight size={18} className="text-slate-300" />
                              </Link>
                            </li>
                          )}
                          {view.href && (
                            <li>
                              <div className="h-px bg-slate-100 mx-4" />
                            </li>
                          )}
                          {view.items.map((item) => (
                            <li key={item.id}>
                              <Link
                                href={item.href || "#"}
                                onClick={closeAndGo}
                                className="w-full flex items-center justify-between px-5 py-3 min-h-[52px] active:bg-primary/[0.08] transition-colors"
                              >
                                <span className="text-[16px] font-medium text-slate-700">
                                  {item.name}
                                </span>
                                <ChevronRight size={18} className="text-slate-300" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
