'use client';

import { TodoProvider } from '@/context/TodoContext';
import AddTodoForm from '@/components/todo/AddTodoForm';
import TodoList from '@/components/todo/TodoList';
import FilterBar from '@/components/todo/FilterBar';

/**
 * TodoApp 主要應用組件
 * 包裝整個Todo應用的根組件
 */
export default function TodoApp() {
  return (
    <TodoProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          {/* 標題區域 */}
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              Todo App
            </h1>
            <p className="mt-2 text-muted-foreground">
              簡單高效的待辦事項管理
            </p>
          </header>

          {/* 主要內容區域 */}
          <main className="space-y-6">
            {/* 新增Todo表單 */}
            <AddTodoForm />

            {/* 篩選器 */}
            <FilterBar />

            {/* Todo清單 */}
            <TodoList />
          </main>
        </div>
      </div>
    </TodoProvider>
  );
}