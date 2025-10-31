// app/components/ThemeToggleButton.tsx
'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggleButton() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Đợi component được mount ở client mới render
  if (!mounted) {
    return <div className="w-10 h-10" />; // Placeholder
  }

  // resolvedTheme sẽ cho biết theme thực tế (ngay cả khi theme="system")
  const isDark = resolvedTheme === 'dark'; 

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}