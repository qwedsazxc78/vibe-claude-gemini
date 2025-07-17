/**
 * 鍵盤快捷鍵幫助組件
 * 顯示所有可用的快捷鍵和說明
 */

import { memo, useMemo } from 'react';
import { KeyboardShortcut, KeyboardCategory } from '@/types/keyboard';
import { formatShortcut } from '@/hooks/useKeyboard';

interface KeyboardHelpProps {
  /** 所有快捷鍵配置 */
  shortcuts: Map<string, KeyboardShortcut>;
  /** 是否顯示幫助面板 */
  visible: boolean;
  /** 關閉幫助面板的回調 */
  onClose: () => void;
}

/**
 * 快捷鍵分類的顯示名稱和順序
 */
const CATEGORY_CONFIG: Record<KeyboardCategory, { name: string; order: number }> = {
  editing: { name: '編輯', order: 1 },
  navigation: { name: '導航', order: 2 },
  filtering: { name: '篩選', order: 3 },
  theme: { name: '主題', order: 4 },
  accessibility: { name: '無障礙', order: 5 },
  general: { name: '一般', order: 6 }
};

/**
 * 快捷鍵幫助組件
 */
export const KeyboardHelp = memo<KeyboardHelpProps>(({
  shortcuts,
  visible,
  onClose
}) => {
  // 按分類組織快捷鍵
  const categorizedShortcuts = useMemo(() => {
    const categories: Record<KeyboardCategory, KeyboardShortcut[]> = {
      editing: [],
      navigation: [],
      filtering: [],
      theme: [],
      accessibility: [],
      general: []
    };

    // 將快捷鍵按分類分組
    shortcuts.forEach(shortcut => {
      if (shortcut.enabled !== false) {
        categories[shortcut.category].push(shortcut);
      }
    });

    // 過濾掉空分類並按順序排序
    return Object.entries(categories)
      .filter(([, shortcuts]) => shortcuts.length > 0)
      .sort(([a], [b]) => 
        CATEGORY_CONFIG[a as KeyboardCategory].order - 
        CATEGORY_CONFIG[b as KeyboardCategory].order
      )
      .map(([category, shortcuts]) => ({
        category: category as KeyboardCategory,
        name: CATEGORY_CONFIG[category as KeyboardCategory].name,
        shortcuts: shortcuts.sort((a, b) => a.description.localeCompare(b.description))
      }));
  }, [shortcuts]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* 標題區域 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">
            鍵盤快捷鍵
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="關閉快捷鍵幫助"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 快捷鍵列表 */}
        <div className="p-6 space-y-6">
          {categorizedShortcuts.map(({ category, name, shortcuts }) => (
            <div key={category}>
              <h3 className="text-lg font-medium text-foreground mb-3">
                {name}
              </h3>
              <div className="space-y-2">
                {shortcuts.map(shortcut => (
                  <div
                    key={shortcut.id}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50"
                  >
                    <span className="text-sm text-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono bg-background border border-border rounded">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 底部說明 */}
        <div className="p-6 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            在輸入欄位中時，快捷鍵會被暫時停用。按 <kbd className="px-1 py-0.5 text-xs bg-background border rounded">Shift + ?</kbd> 可再次顯示此幫助。
          </p>
        </div>
      </div>
    </div>
  );
});

KeyboardHelp.displayName = 'KeyboardHelp';

/**
 * 快捷鍵提示組件
 * 在介面上顯示快捷鍵提示
 */
interface KeyboardHintProps {
  /** 快捷鍵配置 */
  shortcut: KeyboardShortcut;
  /** 是否顯示提示 */
  show?: boolean;
  /** 提示位置 */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** 自定義樣式類名 */
  className?: string;
}

export const KeyboardHint = memo<KeyboardHintProps>(({
  shortcut,
  show = true,
  position = 'bottom',
  className = ''
}) => {
  if (!show) return null;

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  };

  return (
    <div
      className={`absolute ${positionClasses[position]} z-10 ${className}`}
      role="tooltip"
      aria-hidden={!show}
    >
      <div className="bg-popover border border-border rounded-md px-2 py-1 text-xs text-popover-foreground shadow-md">
        <div className="flex items-center gap-1">
          <span>{shortcut.description}</span>
          <kbd className="px-1 py-0.5 bg-background border border-border rounded text-xs">
            {formatShortcut(shortcut)}
          </kbd>
        </div>
      </div>
    </div>
  );
});

KeyboardHint.displayName = 'KeyboardHint';