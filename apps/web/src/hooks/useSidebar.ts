'use client';

import { useState, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'sidebar:open';

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored !== null) {
      setIsOpen(JSON.parse(stored));
    }
  }, []);

  const toggle = () => {
    const newValue = !isOpen;
    setIsOpen(newValue);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newValue));
  };

  const close = () => {
    setIsOpen(false);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(false));
  };

  const open = () => {
    setIsOpen(true);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(true));
  };

  return {
    isOpen,
    toggle,
    close,
    open,
  };
}
