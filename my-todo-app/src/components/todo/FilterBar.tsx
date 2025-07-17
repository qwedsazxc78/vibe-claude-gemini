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
  const filterButtons: { value: FilterType; label: string; shortcut?: string }[] = [
    { value: 'all', label: '全部', shortcut: 'Ctrl + 1' },
    { value: 'active', label: '進行中', shortcut: 'Ctrl + 2' },
    { value: 'completed', label: '已完成', shortcut: 'Ctrl + 3' }
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {filterButtons.map(({ value, label, shortcut }) => (
          <Button
            key={value}
            variant={currentFilter === value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(value)}
            className="relative"
            title={shortcut ? `${label} (${shortcut})` : label}
          >
            <span className="flex items-center gap-2">
              {label}
              <span className="text-xs font-bold transition-all duration-300 ease-in-out">
                ({counts[value]})
              </span>
              {shortcut && (
                <kbd className="hidden sm:inline-block px-1 py-0.5 text-xs bg-background border border-border rounded">
                  {shortcut}
                </kbd>
              )}
            </span>
          </Button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground text-center">
        <span className="inline-flex items-center gap-1">
          💡 快捷鍵：
          <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Ctrl + 1-3</kbd>
          快速切換篩選
        </span>
      </div>
    </div>
  );
}