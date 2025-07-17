'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

/**
 * 主題切換按鈕組件
 * 支援三種主題模式：淺色、深色、系統
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  /**
   * 處理主題切換
   * 按照順序循環：light -> dark -> system -> light
   */
  const handleThemeToggle = () => {
    const themeOrder: Array<typeof theme> = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  /**
   * 取得當前主題對應的圖示
   */
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  /**
   * 取得當前主題對應的提示文字
   */
  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '切換至深色主題';
      case 'dark':
        return '切換至系統主題';
      case 'system':
        return '切換至淺色主題';
      default:
        return '切換主題';
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleThemeToggle}
      className="relative transition-colors hover:bg-accent hover:text-accent-foreground"
      title={getThemeLabel()}
      aria-label={getThemeLabel()}
    >
      {getThemeIcon()}
    </Button>
  );
}

/**
 * 主題切換下拉選單組件（可選的進階版本）
 * 提供更明確的主題選擇介面
 */
export function ThemeToggleDropdown() {
  const { theme } = useTheme();

  const themes = [
    { value: 'light', label: '淺色主題', icon: Sun },
    { value: 'dark', label: '深色主題', icon: Moon },
    { value: 'system', label: '系統主題', icon: Monitor },
  ] as const;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 transition-colors hover:bg-accent hover:text-accent-foreground"
        title="選擇主題"
        aria-label="選擇主題"
      >
        {(() => {
          const currentTheme = themes.find(t => t.value === theme);
          const IconComponent = currentTheme?.icon;
          return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
        })()}
        <span className="hidden sm:inline">
          {themes.find(t => t.value === theme)?.label}
        </span>
      </Button>
      
      {/* 這裡可以加入下拉選單的實作，如果需要的話 */}
      {/* 目前先提供簡單的按鈕版本 */}
    </div>
  );
}