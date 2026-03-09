'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnchorHTMLAttributes, forwardRef } from 'react';

// Extendemos los props nativos de Next/Link y Anchor, añadiendo nuestra bandera 'nofollow'
interface OmittedLinkProps extends Omit<LinkProps, 'href'> {
  href?: LinkProps['href'];
}

interface FilterLinkProps extends OmittedLinkProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  filterKey: string;
  filterValue: string;
  nofollow?: boolean;
}

export const FilterLink = forwardRef<HTMLAnchorElement, FilterLinkProps>(
  ({ filterKey, filterValue, children, nofollow = true, prefetch = false, rel, href: _href, ...props }, ref) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Concatenamos 'nofollow' al atributo reactivo 'rel' si este ya trajera algo (ej. noopener)
    const combinedRel = [rel, nofollow ? 'nofollow' : ''].filter(Boolean).join(' ');

    const currentParams = new URLSearchParams(searchParams.toString());
    
    if (currentParams.get(filterKey) === filterValue) {
      currentParams.delete(filterKey);
    } else {
      currentParams.set(filterKey, filterValue);
    }

    currentParams.delete('page');

    const search = currentParams.toString();
    const href = search ? `${pathname}?${search}` : pathname;

    return (
      <Link 
        ref={ref} 
        href={href}
        rel={combinedRel || undefined} 
        // Opt-out crítico de prefetch: 
        // No queremos que Next.js precargue JSONs de miles de permutaciones de filtros por hover.
        prefetch={prefetch} 
        {...props}
      >
        {children}
      </Link>
    );
  }
);

FilterLink.displayName = 'FilterLink';
