'use client';

import { useState, FormEvent, forwardRef } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * AddTodoForm 組件
 * 提供新增Todo項目的表單介面
 */
const AddTodoForm = forwardRef<HTMLInputElement>((props, ref) => {
  const [text, setText] = useState('');
  const { addTodo } = useTodos();

  /**
   * 處理表單提交
   * @param e 表單事件
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    try {
      addTodo(trimmedText);
      setText(''); // 清空輸入
    } catch (error) {
      console.error('新增Todo失敗:', error);
    }
  };

  /**
   * 處理Enter鍵提交
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Input
            ref={ref}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="新增待辦事項..."
            className="flex-1"
            aria-label="新增待辦事項"
            data-testid="add-todo-input"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            <kbd className="hidden sm:inline-block px-1 py-0.5 bg-muted border border-border rounded text-xs">
              Ctrl + N
            </kbd>
          </div>
        </div>
        <Button 
          type="submit" 
          disabled={!text.trim()}
          aria-label="新增"
        >
          <Plus className="h-4 w-4 mr-1" />
          新增
        </Button>
      </form>
      <div className="text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          💡 快捷鍵：
          <kbd className="px-1 py-0.5 bg-muted border border-border rounded">Ctrl + N</kbd>
          快速聚焦到此輸入框
        </span>
      </div>
    </div>
  );
});

AddTodoForm.displayName = 'AddTodoForm';

export default AddTodoForm;