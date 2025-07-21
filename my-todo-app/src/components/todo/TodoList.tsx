'use client';

import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';
import TodoEmptyState from './TodoEmptyState';
import { AnimatePresence } from 'framer-motion';

/**
 * TodoList 組件
 * 顯示Todo項目清單，包含優化的空狀態設計
 */
export default function TodoList() {
  const { state, getFilteredTodos, setFilter, setSearchQuery } = useTodos();
  const filteredTodos = getFilteredTodos();

  /**
   * 處理新增Todo的回調
   * 聚焦到新增表單的輸入欄位
   */
  const handleAddTodo = () => {
    const addTodoInput = document.querySelector('[data-testid="add-todo-input"]') as HTMLInputElement;
    if (addTodoInput) {
      addTodoInput.focus();
    }
  };

  /**
   * 處理清除搜尋的回調
   */
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  /**
   * 處理篩選切換的回調
   */
  const handleSetFilter = (filter: 'all' | 'active' | 'completed') => {
    setFilter(filter);
  };

  // 顯示空狀態組件
  if (filteredTodos.length === 0) {
    return (
      <TodoEmptyState
        filter={state.filter}
        hasSearchQuery={state.searchQuery.length > 0}
        searchQuery={state.searchQuery}
        onAddTodo={handleAddTodo}
        onClearSearch={handleClearSearch}
        onSetFilter={handleSetFilter}
      />
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </AnimatePresence>
    </div>
  );
}