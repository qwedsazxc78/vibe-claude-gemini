/**
 * Todo應用類型定義
 * 定義Todo項目的資料結構和相關類型
 */

/**
 * Todo項目介面
 * 代表單一待辦事項的資料結構
 */
export interface Todo {
  /** Todo項目的唯一識別碼 */
  id: string;
  
  /** Todo項目的文字內容 */
  text: string;
  
  /** Todo項目是否已完成 */
  completed: boolean;
  
  /** Todo項目的建立時間 */
  createdAt: Date;
}

/**
 * 篩選類型
 * 用於過濾Todo列表的篩選選項
 */
export type FilterType = 'all' | 'active' | 'completed';