import React, { useState, useRef, useEffect, ReactNode, Dispatch, SetStateAction, CSSProperties } from "react";
import styles from "./popover.module.css";

interface PopoverProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export function Popover({ children }: PopoverProps) {
  return <>{children}</>;
}

interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  return <>{children}</>;
}

interface PopoverContentProps {
  children: ReactNode;
  open?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  align?: string;
}

export function PopoverContent({ children, open, onClose, className = "", style, align }: PopoverContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div ref={ref} className={`${styles.popoverContent} ${className}`} style={style} data-align={align}>
      {children}
    </div>
  );
}
