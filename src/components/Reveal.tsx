'use client';
import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

export default function Reveal({
  as: Tag = 'div',
  className = '',
  children,
  stagger = false,
  id,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  stagger?: boolean;
  id?: string;
}) {
  const ref = useReveal<HTMLElement>();
  const cls = [stagger ? 'reveal-stagger' : 'reveal', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} id={id} className={cls}>
      {children}
    </Tag>
  );
}
