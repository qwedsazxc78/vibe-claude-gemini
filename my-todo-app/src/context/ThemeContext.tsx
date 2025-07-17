'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// 主題類型定義
type Theme = 'light' | 'dark' | 'system';

// 主題上下文介面
interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark'; // 實際應用的主題（解析後的系統主題）
}

// 創建主題上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主題提供者組件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // 從 localStorage 載入主題設定
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('載入主題設定失敗:', error);
    }
  }, []);

  // 監聽系統主題變化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateActualTheme = () => {
      if (theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setActualTheme(theme);
      }
    };

    // 初始設定
    updateActualTheme();

    // 監聽系統主題變化
    const handleChange = () => {
      if (theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // 應用主題到 DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // 移除所有主題類別
    root.classList.remove('light', 'dark');
    
    // 添加當前主題類別
    root.classList.add(actualTheme);
    
    // 儲存主題設定到 localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('儲存主題設定失敗:', error);
    }
  }, [theme, actualTheme]);

  // 主題切換函數
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    
    // 立即更新實際主題
    if (newTheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setActualTheme(mediaQuery.matches ? 'dark' : 'light');
    } else {
      setActualTheme(newTheme);
    }
  };

  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用主題的 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}