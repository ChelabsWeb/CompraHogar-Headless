"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { type Subcollection } from "@/lib/constants/collectionHierarchy";

interface SubcategoryCarouselProps {
  parentHandle: string;
  subcollections: Subcollection[];
}

export function SubcategoryCarousel({ parentHandle, subcollections }: SubcategoryCarouselProps) {
  if (!subcollections || subcollections.length === 0) return null;

  return (
    <section className="w-full bg-slate-50 border-b border-slate-200 py-6 mb-8">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Explorar Categorías
          </h2>
        </div>

        {/* CSS Scroll Snapping Container */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
          {subcollections.map((sub) => (
            <Link
              key={sub.handle}
              href={`/collections/${sub.handle}`}
              className="group relative flex-none w-[160px] sm:w-[200px] bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 snap-start overflow-hidden"
            >
              {/* Optional UI: Fallback Image Wrapper */}
              <div className="h-[100px] sm:h-[120px] w-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {sub.image ? (
                  <Image 
                    src={sub.image} 
                    alt={sub.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-bold text-xl uppercase">
                      {sub.name.substring(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3 sm:p-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800 line-clamp-2">
                  {sub.name}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
