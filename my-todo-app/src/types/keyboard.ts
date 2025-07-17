/**
 * 鍵盤快捷鍵類型定義
 * 定義鍵盤快捷鍵的資料結構和相關類型
 */

/**
 * 鍵盤修飾鍵介面
 * 定義可組合的修飾鍵狀態
 */
export interface ModifierKeys {
  /** Ctrl 鍵是否被按下 */
  ctrl?: boolean;
  /** Alt 鍵是否被按下 */
  alt?: boolean;
  /** Shift 鍵是否被按下 */
  shift?: boolean;
  /** Meta 鍵（Windows 鍵或 Cmd 鍵）是否被按下 */
  meta?: boolean;
}

/**
 * 鍵盤快捷鍵配置介面
 * 定義單一快捷鍵的完整配置
 */
export interface KeyboardShortcut {
  /** 快捷鍵的唯一識別碼 */
  id: string;
  /** 主要按鍵代碼 */
  key: string;
  /** 修飾鍵組合 */
  modifiers: ModifierKeys;
  /** 快捷鍵描述 */
  description: string;
  /** 快捷鍵分類 */
  category: KeyboardCategory;
  /** 執行的動作回調函數 */
  action: () => void;
  /** 是否啟用此快捷鍵 */
  enabled?: boolean;
}

/**
 * 鍵盤快捷鍵分類
 * 用於將快捷鍵分組管理
 */
export type KeyboardCategory = 
  | 'navigation'    // 導航相關
  | 'editing'       // 編輯相關
  | 'filtering'     // 篩選相關
  | 'general'       // 一般操作
  | 'accessibility' // 無障礙功能
  | 'theme';        // 主題相關

/**
 * 鍵盤事件處理選項
 * 定義事件處理的配置選項
 */
export interface KeyboardEventOptions {
  /** 是否阻止事件冒泡 */
  stopPropagation?: boolean;
  /** 是否阻止預設行為 */
  preventDefault?: boolean;
  /** 是否只在焦點元素上觸發 */
  onlyWhenFocused?: boolean;
  /** 需要排除的元素標籤 */
  excludeTargets?: string[];
}

/**
 * 鍵盤快捷鍵管理器狀態
 * 管理所有快捷鍵的狀態
 */
export interface KeyboardState {
  /** 所有註冊的快捷鍵 */
  shortcuts: Map<string, KeyboardShortcut>;
  /** 是否啟用快捷鍵功能 */
  enabled: boolean;
  /** 目前焦點的快捷鍵 ID */
  focusedShortcut: string | null;
  /** 快捷鍵幫助面板是否顯示 */
  helpVisible: boolean;
}

/**
 * 鍵盤事件處理結果
 * 表示快捷鍵處理的結果
 */
export interface KeyboardEventResult {
  /** 是否成功處理了事件 */
  handled: boolean;
  /** 觸發的快捷鍵 ID */
  shortcutId?: string;
  /** 處理過程中的錯誤 */
  error?: Error;
}

/**
 * 預設快捷鍵配置
 * 定義應用程式的預設快捷鍵
 */
export interface DefaultShortcuts {
  /** 新增待辦事項 */
  ADD_TODO: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 搜尋待辦事項 */
  SEARCH_TODO: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 切換主題 */
  TOGGLE_THEME: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 顯示幫助 */
  SHOW_HELP: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 顯示全部 */
  FILTER_ALL: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 顯示進行中 */
  FILTER_ACTIVE: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 顯示已完成 */
  FILTER_COMPLETED: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
  /** 清空搜尋 */
  CLEAR_SEARCH: Pick<KeyboardShortcut, 'key' | 'modifiers' | 'description' | 'category'>;
}