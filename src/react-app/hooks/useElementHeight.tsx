"use client";

import { useEffect, useState, useRef, RefCallback } from "react";

export function useElementHeight() {
  const [height, setHeight] = useState<number | null>(null);

  // Usamos um ref que aceita função (callback ref)
  const elementRef = useRef<HTMLElement | null>(null);

  const refCallback: RefCallback<HTMLElement> = (node) => {
    if (!node) return;

    // Guarda referência
    elementRef.current = node;

    // Observa mudanças de tamanho
    const observer = new ResizeObserver(() => {
      setHeight(node.offsetHeight);
    });

    observer.observe(node);
  };

  // Cleanup para evitar memory leaks
  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      setHeight(node.offsetHeight);
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { height, refCallback };
}