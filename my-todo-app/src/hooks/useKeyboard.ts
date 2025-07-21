/**
 * 鍵盤快捷鍵管理 Hook
 * 提供完整的鍵盤快捷鍵功能，包括註冊、處理和管理
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  KeyboardShortcut,
  KeyboardState,
  KeyboardEventResult,
  KeyboardEventOptions,
  ModifierKeys,
  DefaultShortcuts
} from '@/types/keyboard';

/**
 * 預設快捷鍵配置
 * 定義應用程式的基本快捷鍵
 */
const DEFAULT_SHORTCUTS: DefaultShortcuts = {
  ADD_TODO: {
    key: 'n',
    modifiers: { ctrl: true },
    description: '新增待辦事項',
    category: 'editing'
  },
  SEARCH_TODO: {
    key: 'f',
    modifiers: { ctrl: true },
    description: '搜尋待辦事項',
    category: 'navigation'
  },
  TOGGLE_THEME: {
    key: 't',
    modifiers: { ctrl: true },
    description: '切換主題',
    category: 'theme'
  },
  SHOW_HELP: {
    key: '?',
    modifiers: { shift: true },
    description: '顯示快捷鍵幫助',
    category: 'accessibility'
  },
  FILTER_ALL: {
    key: '1',
    modifiers: { ctrl: true },
    description: '顯示全部待辦事項',
    category: 'filtering'
  },
  FILTER_ACTIVE: {
    key: '2',
    modifiers: { ctrl: true },
    description: '顯示進行中待辦事項',
    category: 'filtering'
  },
  FILTER_COMPLETED: {
    key: '3',
    modifiers: { ctrl: true },
    description: '顯示已完成待辦事項',
    category: 'filtering'
  },
  CLEAR_SEARCH: {
    key: 'Escape',
    modifiers: {},
    description: '清空搜尋',
    category: 'navigation'
  }
};

/**
 * 預設事件處理選項
 */
const DEFAULT_EVENT_OPTIONS: KeyboardEventOptions = {
  stopPropagation: true,
  preventDefault: true,
  onlyWhenFocused: false,
  excludeTargets: ['input', 'textarea', 'select']
};

/**
 * 鍵盤快捷鍵管理 Hook
 * 
 * @param options - 事件處理選項
 * @returns 鍵盤快捷鍵管理器
 */
export function useKeyboard(options: KeyboardEventOptions = {}): {
  state: KeyboardState;
  registerShortcut: (shortcut: KeyboardShortcut) => void;
  unregisterShortcut: (id: string) => void;
  toggleEnabled: () => void;
  toggleHelp: () => void;
  getShortcutsByCategory: (category: string) => KeyboardShortcut[];
  resetToDefaults: () => void;
} {
  const eventOptions = useMemo(() => ({ ...DEFAULT_EVENT_OPTIONS, ...options }), [options]);
  
  // 狀態管理
  const [state, setState] = useState<KeyboardState>({
    shortcuts: new Map(),
    enabled: true,
    focusedShortcut: null,
    helpVisible: false
  });
  
  // 使用 ref 來避免閉包問題
  const stateRef = useRef(state);
  stateRef.current = state;

  /**
   * 檢查修飾鍵是否匹配
   * 
   * @param event - 鍵盤事件
   * @param modifiers - 期望的修飾鍵
   * @returns 是否匹配
   */
  const checkModifiers = useCallback((event: KeyboardEvent, modifiers: ModifierKeys): boolean => {
    return (
      (!!modifiers.ctrl === event.ctrlKey) &&
      (!!modifiers.alt === event.altKey) &&
      (!!modifiers.shift === event.shiftKey) &&
      (!!modifiers.meta === event.metaKey)
    );
  }, []);

  /**
   * 檢查事件目標是否應該被排除
   * 
   * @param target - 事件目標元素
   * @returns 是否應該排除
   */
  const shouldExcludeTarget = useCallback((target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) {
      return false;
    }

    const tagName = target.tagName.toLowerCase();
    return eventOptions.excludeTargets?.includes(tagName) || false;
  }, [eventOptions.excludeTargets]);

  /**
   * 鍵盤事件處理器
   * 
   * @param event - 鍵盤事件
   * @returns 處理結果
   */
  const handleKeyDown = useCallback((event: KeyboardEvent): KeyboardEventResult => {
    const currentState = stateRef.current;
    
    // 如果快捷鍵功能未啟用，直接返回
    if (!currentState.enabled) {
      return { handled: false };
    }

    // 檢查是否應該排除此目標
    if (shouldExcludeTarget(event.target)) {
      return { handled: false };
    }

    // 遍歷所有快捷鍵尋找匹配的
    for (const [id, shortcut] of currentState.shortcuts) {
      if (
        shortcut.enabled !== false &&
        shortcut.key.toLowerCase() === event.key.toLowerCase() &&
        checkModifiers(event, shortcut.modifiers)
      ) {
        try {
          // 根據選項處理事件
          if (eventOptions.stopPropagation) {
            event.stopPropagation();
          }
          if (eventOptions.preventDefault) {
            event.preventDefault();
          }

          // 執行快捷鍵動作
          shortcut.action();

          return { handled: true, shortcutId: id };
        } catch (error) {
          console.error(`執行快捷鍵 ${id} 時發生錯誤:`, error);
          return { handled: false, shortcutId: id, error: error as Error };
        }
      }
    }

    return { handled: false };
  }, [checkModifiers, shouldExcludeTarget, eventOptions]);

  /**
   * 註冊快捷鍵
   * 
   * @param shortcut - 快捷鍵配置
   */
  const registerShortcut = useCallback((shortcut: KeyboardShortcut): void => {
    setState(prev => ({
      ...prev,
      shortcuts: new Map(prev.shortcuts.set(shortcut.id, shortcut))
    }));
  }, []);

  /**
   * 取消註冊快捷鍵
   * 
   * @param id - 快捷鍵 ID
   */
  const unregisterShortcut = useCallback((id: string): void => {
    setState(prev => {
      const newShortcuts = new Map(prev.shortcuts);
      newShortcuts.delete(id);
      return {
        ...prev,
        shortcuts: newShortcuts
      };
    });
  }, []);

  /**
   * 切換快捷鍵功能啟用狀態
   */
  const toggleEnabled = useCallback((): void => {
    setState(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  }, []);

  /**
   * 切換幫助面板顯示狀態
   */
  const toggleHelp = useCallback((): void => {
    setState(prev => ({
      ...prev,
      helpVisible: !prev.helpVisible
    }));
  }, []);

  /**
   * 根據分類獲取快捷鍵
   * 
   * @param category - 快捷鍵分類
   * @returns 該分類的快捷鍵陣列
   */
  const getShortcutsByCategory = useCallback((category: string): KeyboardShortcut[] => {
    return Array.from(state.shortcuts.values())
      .filter(shortcut => shortcut.category === category);
  }, [state.shortcuts]);

  /**
   * 重置為預設快捷鍵
   */
  const resetToDefaults = useCallback((): void => {
    setState(prev => ({
      ...prev,
      shortcuts: new Map()
    }));
  }, []);

  // 設定事件監聽器
  useEffect(() => {
    const handleKeyDownEvent = (event: KeyboardEvent) => {
      handleKeyDown(event);
    };

    document.addEventListener('keydown', handleKeyDownEvent);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  }, [handleKeyDown]);

  return {
    state,
    registerShortcut,
    unregisterShortcut,
    toggleEnabled,
    toggleHelp,
    getShortcutsByCategory,
    resetToDefaults
  };
}

/**
 * 鍵盤快捷鍵管理器 Hook（帶預設快捷鍵）
 * 
 * @param actions - 快捷鍵動作映射
 * @param options - 事件處理選項
 * @returns 鍵盤快捷鍵管理器
 */
export function useKeyboardWithDefaults(
  actions: Partial<Record<keyof DefaultShortcuts, () => void>>,
  options: KeyboardEventOptions = {}
) {
  const keyboard = useKeyboard(options);

  // 註冊預設快捷鍵
  useEffect(() => {
    Object.entries(DEFAULT_SHORTCUTS).forEach(([key, config]) => {
      const actionKey = key as keyof DefaultShortcuts;
      const action = actions[actionKey];
      
      if (action) {
        keyboard.registerShortcut({
          id: key,
          ...config,
          action
        });
      }
    });

    // 清理函數
    return () => {
      Object.keys(DEFAULT_SHORTCUTS).forEach(key => {
        keyboard.unregisterShortcut(key);
      });
    };
  }, [actions, keyboard]);

  return keyboard;
}

/**
 * 格式化快捷鍵顯示文字
 * 
 * @param shortcut - 快捷鍵配置
 * @returns 格式化的快捷鍵文字
 */
export function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts: string[] = [];
  
  if (shortcut.modifiers.ctrl) parts.push('Ctrl');
  if (shortcut.modifiers.alt) parts.push('Alt');
  if (shortcut.modifiers.shift) parts.push('Shift');
  if (shortcut.modifiers.meta) parts.push('⌘');
  
  parts.push(shortcut.key.toUpperCase());
  
  return parts.join(' + ');
}