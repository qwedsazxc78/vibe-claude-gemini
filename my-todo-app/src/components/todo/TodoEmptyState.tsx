'use client';

import { motion } from 'framer-motion';
import { Plus, Search, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterType } from '@/types/todo';

/**
 * 空狀態配置介面
 * 定義每種篩選狀態下的空狀態內容
 */
interface EmptyStateConfig {
  /** 圖示元件 */
  icon: React.ComponentType<{ className?: string }>;
  /** 主要標題 */
  title: string;
  /** 描述文字 */
  description: string;
  /** 行動按鈕文字 */
  actionText?: string;
  /** 行動按鈕點擊處理 */
  onAction?: () => void;
}

/**
 * 空狀態組件屬性介面
 */
interface TodoEmptyStateProps {
  /** 當前篩選類型 */
  filter: FilterType;
  /** 是否有搜尋查詢 */
  hasSearchQuery: boolean;
  /** 搜尋查詢文字 */
  searchQuery?: string;
  /** 新增Todo回調函數 */
  onAddTodo?: () => void;
  /** 清除搜尋回調函數 */
  onClearSearch?: () => void;
  /** 切換篩選回調函數 */
  onSetFilter?: (filter: FilterType) => void;
  /** 錯誤狀態 */
  error?: string;
  /** 載入狀態 */
  isLoading?: boolean;
}

/**
 * 取得空狀態配置
 * 根據當前篩選類型和搜尋狀態返回對應的空狀態配置
 */
const getEmptyStateConfig = (
  filter: FilterType,
  hasSearchQuery: boolean,
  searchQuery: string = '',
  onAddTodo?: () => void,
  onClearSearch?: () => void,
  onSetFilter?: (filter: FilterType) => void
): EmptyStateConfig => {
  // 搜尋結果為空的情況
  if (hasSearchQuery) {
    return {
      icon: Search,
      title: '找不到相關項目',
      description: `沒有找到包含「${searchQuery}」的待辦事項`,
      actionText: '清除搜尋',
      onAction: onClearSearch
    };
  }

  // 根據篩選類型返回對應配置
  switch (filter) {
    case 'active':
      return {
        icon: Circle,
        title: '太棒了！',
        description: '你已經完成了所有待辦事項',
        actionText: '新增更多任務',
        onAction: onAddTodo
      };

    case 'completed':
      return {
        icon: CheckCircle,
        title: '還沒有完成的項目',
        description: '完成一些待辦事項後，它們會顯示在這裡',
        actionText: '查看所有項目',
        onAction: () => onSetFilter?.('all')
      };

    default: // 'all'
      return {
        icon: Plus,
        title: '開始你的待辦清單',
        description: '新增你的第一個待辦事項來開始管理你的任務',
        actionText: '新增待辦事項',
        onAction: onAddTodo
      };
  }
};

/**
 * TodoEmptyState 組件
 * 顯示Todo列表為空時的優雅空狀態介面
 * 
 * @component
 * @example
 * ```tsx
 * <TodoEmptyState
 *   filter="all"
 *   hasSearchQuery={false}
 *   onAddTodo={() => console.log('Add todo')}
 * />
 * ```
 */
export default function TodoEmptyState({
  filter,
  hasSearchQuery,
  searchQuery = '',
  onAddTodo,
  onClearSearch,
  onSetFilter,
  error,
  isLoading = false
}: TodoEmptyStateProps) {
  // 錯誤狀態處理
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-destructive">載入失敗</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          size="sm"
        >
          重新載入
        </Button>
      </motion.div>
    );
  }

  // 載入狀態處理
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-16 px-4 text-center"
        role="status"
        aria-live="polite"
        aria-label="正在載入待辦事項"
      >
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
        <p className="text-muted-foreground">載入中...</p>
      </motion.div>
    );
  }

  const config = getEmptyStateConfig(
    filter,
    hasSearchQuery,
    searchQuery,
    onAddTodo,
    onClearSearch,
    onSetFilter
  );

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-live="polite"
    >
      {/* 圖示容器 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 0.2,
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="mb-6"
      >
        <div className="relative">
          {/* 背景圓圈 */}
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <IconComponent className="w-12 h-12 text-muted-foreground" />
          </div>
          
          {/* 裝飾性動畫圓圈 */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 w-24 h-24 bg-primary rounded-full -z-10"
          />
        </div>
      </motion.div>

      {/* 標題 */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.3,
          duration: 0.3
        }}
        className="text-xl font-semibold mb-2 text-foreground"
      >
        {config.title}
      </motion.h3>

      {/* 描述文字 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          delay: 0.4,
          duration: 0.3
        }}
        className="text-muted-foreground mb-8 max-w-md leading-relaxed"
      >
        {config.description}
      </motion.p>

      {/* 行動按鈕 */}
      {config.actionText && config.onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.5,
            duration: 0.3
          }}
        >
          <Button
            onClick={config.onAction}
            className="gap-2 shadow-sm hover:shadow-md transition-shadow"
            size="lg"
            aria-describedby={filter === 'all' && !hasSearchQuery ? 'keyboard-hint' : undefined}
          >
            <IconComponent className="w-4 h-4" />
            {config.actionText}
          </Button>
        </motion.div>
      )}

      {/* 鍵盤快捷鍵提示 */}
      {filter === 'all' && !hasSearchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 0.8,
            duration: 0.3
          }}
          className="mt-6 text-xs text-muted-foreground/70"
          id="keyboard-hint"
        >
          <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> 快速新增
        </motion.div>
      )}
    </motion.div>
  );
}