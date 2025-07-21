'use client';

import { useContext } from 'react';
import { TodoContext } from '@/context/TodoContext';

/**
 * useTodos 自訂Hook
 * 簡化TodoContext的使用，提供方便的Todo操作介面
 * 
 * @returns TodoContext的所有功能
 * @throws 如果在TodoProvider外使用會拋出錯誤
 * 
 * @example
 * ```tsx
 * function TodoList() {
 *   const { getFilteredTodos, toggleTodo, deleteTodo } = useTodos();
 *   const todos = getFilteredTodos();
 *   
 *   return (
 *     <ul>
 *       {todos.map(todo => (
 *         <li key={todo.id}>
 *           <span onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
 *           <button onClick={() => deleteTodo(todo.id)}>刪除</button>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useTodos() {
  const context = useContext(TodoContext);

  /**
   * 確保Hook在TodoProvider內使用
   */
  if (!context) {
    throw new Error('useTodos 必須在 TodoProvider 內使用');
  }

  return context;
}

/**
 * 導出個別功能的便利Hook
 */

/**
 * 只取得Todo狀態
 */
export function useTodoState() {
  const { state } = useTodos();
  return state;
}

/**
 * 只取得Todo操作方法
 */
export function useTodoActions() {
  const { addTodo, toggleTodo, deleteTodo, setFilter } = useTodos();
  return { addTodo, toggleTodo, deleteTodo, setFilter };
}

/**
 * 只取得篩選後的Todo列表
 */
export function useFilteredTodos() {
  const { getFilteredTodos } = useTodos();
  return getFilteredTodos();
}