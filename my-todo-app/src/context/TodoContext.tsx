'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Todo, FilterType } from '@/types/todo';

/**
 * Todo Context 狀態介面
 * 定義Context中儲存的狀態資料
 */
interface TodoState {
  /** Todo項目陣列 */
  todos: Todo[];
  /** 當前篩選類型 */
  filter: FilterType;
}

/**
 * Todo Reducer Action 類型
 * 定義所有可能的狀態更新動作
 */
type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'LOAD_TODOS'; payload: Todo[] };

/**
 * Todo Context 介面
 * 定義Context提供的狀態和方法
 */
interface TodoContextType {
  /** 狀態資料 */
  state: TodoState;
  /** 新增Todo項目 */
  addTodo: (text: string) => void;
  /** 切換Todo完成狀態 */
  toggleTodo: (id: string) => void;
  /** 刪除Todo項目 */
  deleteTodo: (id: string) => void;
  /** 設定篩選類型 */
  setFilter: (filter: FilterType) => void;
  /** 取得篩選後的Todo列表 */
  getFilteredTodos: () => Todo[];
}

/**
 * 建立Todo Context
 */
export const TodoContext = createContext<TodoContextType | null>(null);

/**
 * 初始狀態
 */
const initialState: TodoState = {
  todos: [],
  filter: 'all'
};

/**
 * LocalStorage 鍵名
 */
const STORAGE_KEY = 'todo-app-state';

/**
 * Todo Reducer
 * 處理所有狀態更新邏輯
 */
function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO': {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: new Date()
      };
      return {
        ...state,
        todos: [...state.todos, newTodo]
      };
    }

    case 'TOGGLE_TODO': {
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    }

    case 'DELETE_TODO': {
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    }

    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.payload
      };
    }

    case 'LOAD_TODOS': {
      return {
        ...state,
        todos: action.payload
      };
    }

    default:
      return state;
  }
}

/**
 * Todo Provider 元件
 * 提供Todo Context給子元件使用
 */
export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  /**
   * 從LocalStorage載入資料
   */
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // 恢復日期物件
        const todos = parsedState.todos.map((todo: Omit<Todo, 'createdAt'> & { createdAt: string }) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        dispatch({ type: 'LOAD_TODOS', payload: todos });
        if (parsedState.filter) {
          dispatch({ type: 'SET_FILTER', payload: parsedState.filter });
        }
      }
    } catch (error) {
      console.error('載入Todo資料失敗:', error);
    }
  }, []);

  /**
   * 儲存資料到LocalStorage
   */
  useEffect(() => {
    try {
      const dataToSave = {
        todos: state.todos,
        filter: state.filter
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('儲存Todo資料失敗:', error);
    }
  }, [state]);

  /**
   * 新增Todo項目
   * @param text Todo文字內容
   */
  const addTodo = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      console.error('Todo文字不能為空');
      return;
    }
    dispatch({ type: 'ADD_TODO', payload: trimmedText });
  };

  /**
   * 切換Todo完成狀態
   * @param id Todo項目ID
   */
  const toggleTodo = (id: string) => {
    const todoExists = state.todos.some(todo => todo.id === id);
    if (!todoExists) {
      console.error(`找不到ID為 ${id} 的Todo項目`);
      return;
    }
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  /**
   * 刪除Todo項目
   * @param id Todo項目ID
   */
  const deleteTodo = (id: string) => {
    const todoExists = state.todos.some(todo => todo.id === id);
    if (!todoExists) {
      console.error(`找不到ID為 ${id} 的Todo項目`);
      return;
    }
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  /**
   * 設定篩選類型
   * @param filter 篩選類型
   */
  const setFilter = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  /**
   * 取得篩選後的Todo列表
   * @returns 根據當前篩選條件過濾的Todo陣列
   */
  const getFilteredTodos = (): Todo[] => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed);
      case 'completed':
        return state.todos.filter(todo => todo.completed);
      case 'all':
      default:
        return state.todos;
    }
  };

  const value: TodoContextType = {
    state,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    getFilteredTodos
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
}