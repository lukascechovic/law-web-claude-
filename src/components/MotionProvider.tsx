'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'animations-enabled';

interface MotionContextValue {
  animationsEnabled: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionContextValue>({
  animationsEnabled: true,
  toggle: () => {},
});

export function useMotionPreference() {
  return useContext(MotionContext);
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'false') setAnimationsEnabled(false);
  }, []);

  function toggle() {
    setAnimationsEnabled(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <MotionContext.Provider value={{ animationsEnabled, toggle }}>
      {children}
    </MotionContext.Provider>
  );
}
