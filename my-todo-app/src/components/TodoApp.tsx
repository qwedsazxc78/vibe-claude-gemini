'use client';

import { TodoProvider } from '@/context/TodoContext';
import AddTodoForm from '@/components/todo/AddTodoForm';
import TodoList from '@/components/todo/TodoList';
import FilterBar from '@/components/todo/FilterBar';
import SearchBar from '@/components/todo/SearchBar';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTodos } from '@/hooks/useTodos';

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
  const { state, setSearchQuery } = useTodos();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <header className="mb-8 text-center relative">
          <div className="absolute top-0 right-0">
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
          <AddTodoForm />

          {/* 搜尋欄 */}
          <SearchBar onSearch={setSearchQuery} currentQuery={state.searchQuery} />

          {/* 篩選器 */}
          <FilterBar />

          {/* Todo清單 */}
          <TodoList />
        </main>
      </div>
    </div>
  );
}