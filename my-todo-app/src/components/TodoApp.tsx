'use client';

import { TodoProvider } from '@/context/TodoContext';
import AddTodoForm from '@/components/todo/AddTodoForm';
import TodoList from '@/components/todo/TodoList';
import FilterBar from '@/components/todo/FilterBar';
import SearchBar from '@/components/todo/SearchBar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { KeyboardHelp } from '@/components/ui/keyboard-help';
import { useTodos } from '@/hooks/useTodos';
import { useTheme } from '@/context/ThemeContext';
import { useKeyboard, useKeyboardWithDefaults } from '@/hooks/useKeyboard';
import { useRef } from 'react';

/**
 * TodoApp 主要應用組件
 * 包裝整個Todo應用的根組件
 */
export default function TodoApp() {
  return (
    <TodoProvider>
      <TodoAppContent />
    </TodoProvider>
  );
}

function TodoAppContent() {
  const { state, setSearchQuery, setFilter } = useTodos();
  const { theme, setTheme } = useTheme();
  const addTodoInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 使用鍵盤管理器
  const keyboard = useKeyboard();

  // 設定鍵盤快捷鍵動作
  const keyboardActions = {
    ADD_TODO: () => {
      // 聚焦到新增待辦事項輸入框
      if (addTodoInputRef.current) {
        addTodoInputRef.current.focus();
      }
    },
    SEARCH_TODO: () => {
      // 聚焦到搜尋輸入框
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    },
    TOGGLE_THEME: () => {
      // 切換主題（簡單的 light/dark 切換）
      setTheme(theme === 'dark' ? 'light' : 'dark');
    },
    SHOW_HELP: () => {
      keyboard.toggleHelp();
    },
    FILTER_ALL: () => {
      setFilter('all');
    },
    FILTER_ACTIVE: () => {
      setFilter('active');
    },
    FILTER_COMPLETED: () => {
      setFilter('completed');
    },
    CLEAR_SEARCH: () => {
      setSearchQuery('');
      // 如果搜尋框有焦點，移除焦點
      if (searchInputRef.current && document.activeElement === searchInputRef.current) {
        searchInputRef.current.blur();
      }
    }
  };

  // 初始化預設快捷鍵
  useKeyboardWithDefaults(keyboardActions);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <button
              onClick={keyboard.toggleHelp}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
              title="顯示鍵盤快捷鍵 (Shift + ?)"
              aria-label="顯示鍵盤快捷鍵"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Todo App
          </h1>
          <p className="mt-2 text-muted-foreground">
            簡單高效的待辦事項管理
          </p>
        </header>

        {/* 主要內容區域 */}
        <main className="space-y-6 p-6 bg-card rounded-lg shadow-lg">
          {/* 新增Todo表單 */}
          <AddTodoForm ref={addTodoInputRef} />

          {/* 搜尋欄 */}
          <SearchBar 
            ref={searchInputRef}
            onSearch={setSearchQuery} 
            currentQuery={state.searchQuery} 
          />

          {/* 篩選器 */}
          <FilterBar />

          {/* Todo清單 */}
          <TodoList />
        </main>

        {/* 鍵盤快捷鍵幫助 */}
        <KeyboardHelp
          shortcuts={keyboard.state.shortcuts}
          visible={keyboard.state.helpVisible}
          onClose={keyboard.toggleHelp}
        />
      </div>
    </div>
  );
}