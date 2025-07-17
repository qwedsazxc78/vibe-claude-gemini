'use client';

import { useState, FormEvent } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * AddTodoForm 組件
 * 提供新增Todo項目的表單介面
 */
export default function AddTodoForm() {
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
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="新增待辦事項..."
        className="flex-1"
        aria-label="新增待辦事項"
        data-testid="add-todo-input"
      />
      <Button 
        type="submit" 
        disabled={!text.trim()}
        aria-label="新增"
      >
        <Plus className="h-4 w-4 mr-1" />
        新增
      </Button>
    </form>
  );
}