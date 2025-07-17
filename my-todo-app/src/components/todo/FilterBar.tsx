'use client';

import { FilterType } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { Button } from '@/components/ui/button';

/**
 * FilterBar 組件
 * 提供Todo篩選功能，顯示各類別數量
 */
export default function FilterBar() {
  const { state, setFilter } = useTodos();
  const { todos, filter: currentFilter } = state;

  /**
   * 計算各類別的Todo數量
   */
  const counts = {
    all: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  /**
   * 篩選按鈕配置
   */
  const filterButtons: { value: FilterType; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'active', label: '進行中' },
    { value: 'completed', label: '已完成' }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filterButtons.map(({ value, label }) => (
        <Button
          key={value}
          variant={currentFilter === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(value)}
          className="relative"
        >
          {label}
          <span className="ml-2 text-xs font-bold transition-all duration-300 ease-in-out">
            ({counts[value]})
          </span>
        </Button>
      ))}
    </div>
  );
}