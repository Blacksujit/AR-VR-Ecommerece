'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const item = window.localStorage.getItem(key);
      if (item) setValue(JSON.parse(item));
    } catch { /* noop */ }
  }, [key, mounted]);

  const setStoredValue = (val: T | ((prev: T) => T)) => {
    const next = val instanceof Function ? val(value) : val;
    setValue(next);
    if (mounted) window.localStorage.setItem(key, JSON.stringify(next));
  };

  return [value, setStoredValue] as const;
}
