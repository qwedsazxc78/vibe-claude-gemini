'use client';

import { useTodos } from '@/hooks/useTodos';
import TodoItem from './TodoItem';

/**
 * TodoList 組件
 * 顯示Todo項目清單
 */
export default function TodoList() {
  const { state, getFilteredTodos } = useTodos();
  const filteredTodos = getFilteredTodos();

  /**
   * 空清單提示內容
   */
  const getEmptyMessage = () => {
    switch (state.filter) {
      case 'active':
        return '沒有進行中的待辦事項';
      case 'completed':
        return '沒有已完成的待辦事項';
      default:
        return '還沒有待辦事項，新增一個吧！';
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}