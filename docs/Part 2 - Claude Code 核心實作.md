# 新手精簡版 Part 2: Claude Code 核心實作

## 🧠 Claude Code 溝通技巧

✅ **好指令**: "建立Todo類型，包含id、文字、完成狀態"
❌ **差指令**: "幫我寫程式"

## 🔧 步驟1: 建立資料結構

```bash
claude "建立 src/types/todo.ts 檔案。

定義Todo應用類型系統：
1. Todo項目: id(字串)、text(字串)、completed(布林值)、createdAt(日期)
2. 篩選類型: 'all' | 'active' | 'completed'

使用TypeScript介面，加上註釋。"
```

## 📊 步驟2: 狀態管理

```bash
claude "建立 src/context/TodoContext.tsx。

使用React Context管理Todo狀態：
1. 功能: 新增、切換完成、刪除、篩選Todo
2. 技術: useReducer + localStorage持久化
3. 使用剛建立的types/todo.ts

包含詳細註釋和錯誤處理。"

claude "建立 src/hooks/useTodos.ts。

自訂Hook簡化TodoContext使用：
- 包裝Context操作
- 提供簡單的Todo操作方法
- TypeScript類型支援"
```

## 🎨 步驟3: 基本UI組件

```bash
claude "建立 src/components/TodoApp.tsx。

主要Todo應用組件：
1. 用TodoProvider包裝
2. 基本佈局結構含標題
3. 使用TailwindCSS + shadcn/ui
4. 先建立結構，暫不實作功能"

claude "修改 src/app/page.tsx。
移除預設內容，改用TodoApp組件。"
```

## ➕ 步驟4: 新增Todo功能

```bash
claude "建立 src/components/todo/AddTodoForm.tsx。

新增Todo表單：
1. 功能: 文字輸入、新增按鈕、Enter鍵支援
2. 設計: shadcn/ui Input + Button組件
3. 邏輯: useTodos Hook、表單驗證、清空輸入"

claude "修改 TodoApp.tsx，加入AddTodoForm組件。"
```

## 📝 步驟5: Todo清單顯示

```bash
claude "建立 src/components/todo/TodoItem.tsx。

單個Todo項目組件：
1. 顯示Todo文字、完成勾選框、刪除按鈕
2. 視覺: 已完成項目有刪除線、適當圖示
3. 功能: 使用useTodos Hook處理切換和刪除"

claude "建立 src/components/todo/TodoList.tsx。

Todo清單組件：
1. 顯示所有Todo，使用TodoItem
2. 處理空清單狀態
3. 使用useTodos Hook取得資料"

claude "修改 TodoApp.tsx，加入TodoList組件。"
```

## 🔍 步驟6: 篩選功能

```bash
claude "建立 src/components/todo/FilterBar.tsx。

篩選功能：
1. 三個按鈕: 全部/進行中/已完成
2. 顯示各類別數量，高亮當前篩選
3. 使用shadcn/ui Button組件"

claude "修改 TodoList.tsx 支援篩選，根據篩選器顯示對應Todo。"

claude "修改 TodoApp.tsx，加入FilterBar組件。"
```

## 🧪 測試功能

在 http://localhost:3000 測試：

```
□ 新增Todo  □ 顯示清單  □ 切換完成  □ 刪除Todo
□ 篩選功能  □ 資料持久化(重新整理後仍在)
```

## ✅ Part 2 完成！

**Claude Code特色**:
* 🧠 邏輯思維清晰，完整架構
* 📝 程式碼品質高，註釋詳細
* ⚙️ 錯誤處理完善，類型安全

**學到的模式**:
* 類型先行 → 狀態管理 → 組件實作
* 一次一個功能，逐步建立
* 清楚描述需求，檢查結果

**下一步**: Gemini CLI將審查優化，讓App更美更好用！ ✨
