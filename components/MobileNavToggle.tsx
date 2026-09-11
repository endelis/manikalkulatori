'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MobileNavToggleProps {
  categories: { slug: string; title: string }[];
}

export function MobileNavToggle({ categories }: MobileNavToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-panel-border text-panel-text"
      >
        <span className="sr-only">Izvēlne</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-t border-panel-border bg-panel-surface p-4 shadow-sm"
        >
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-panel-text hover:bg-panel-surface-2"
            >
              {category.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
