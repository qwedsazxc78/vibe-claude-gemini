'use client';

import { Todo } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * TodoItem 組件屬性
 */
interface TodoItemProps {
  /** Todo項目資料 */
  todo: Todo;
}

/**
 * TodoItem 組件
 * 顯示單個Todo項目，包含勾選框、文字和刪除按鈕
 */
export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodos();

  /**
   * 處理勾選框變更
   */
  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  /**
   * 處理刪除按鈕點擊
   */
  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card shadow-sm hover:bg-accent/50 transition-all duration-200 ease-in-out"
    >
      {/* 勾選框 */}
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={handleToggle}
        aria-label={`標記 "${todo.text}" ${todo.completed ? '未完成' : '已完成'}`}
      />

      {/* Todo文字 */}
      <label
        htmlFor={`todo-${todo.id}`}
        className={`flex-1 cursor-pointer transition-all duration-200 ease-in-out ${
          todo.completed
            ? 'text-muted-foreground line-through'
            : 'text-foreground'
        }`}
      >
        {todo.text}
      </label>

      {/* 刪除按鈕 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        aria-label={`刪除 "${todo.text}"`}
        className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors duration-200 ease-in-out"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}