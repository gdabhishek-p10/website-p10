'use client';
import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

export default function Reveal({
  as: Tag = 'div',
  className = '',
  children,
  stagger = false,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  stagger?: boolean;
}) {
  const ref = useReveal<HTMLElement>();
  const cls = [stagger ? 'reveal-stagger' : 'reveal', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls}>
      {children}
    </Tag>
  );
}
