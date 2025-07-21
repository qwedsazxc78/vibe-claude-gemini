# 新手精簡版 Part 1: 快速環境設定

## 🎯 5分鐘了解

我們要用兩個AI助手建立Todo App：
* **Claude Code**: 寫程式邏輯 🧠
* **Gemini CLI**: 美化優化 ✨

## 🚀 快速安裝

```bash
# 1. 安裝工具
npm install -g pnpm
pnpm install -g @google/gemini-cli
pnpm install -g @anthropic-ai/claude-code

# 2. 認證 (Gemini免費，Claude需付費)
gemini "Hello"  # 會開啟瀏覽器登入Google
claude config set api-key YOUR_API_KEY  # 需要Anthropic帳戶

# 3. 建立專案
pnpm create next-app@latest my-todo-app --typescript --tailwind --app --eslint
cd my-todo-app

# 4. 安裝UI組件
pnpm dlx shadcn-ui@latest init --defaults
pnpm dlx shadcn-ui@latest add button input card checkbox
```

## 📁 建立AI指導文件

**CLAUDE.md**:

```markdown
# Claude 工作指南
- 負責: 程式邏輯、TypeScript類型、狀態管理
- 要求: 嚴格類型、詳細註釋、錯誤處理
- 技術: Next.js 15 + TypeScript + shadcn/ui
```

**GEMINI.md**:

```markdown
# Gemini 工作指南
- 負責: UI優化、使用者體驗、視覺設計
- 要求: 響應式設計、動畫效果、可訪問性
- 目標: 美觀、易用、流暢
```

## ✅ 驗證設定

```bash
# 測試AI工具
gemini -p "檢查Next.js專案設定"
claude "分析專案結構"

# 啟動開發
pnpm dev  # http://localhost:3000
```

**完成！準備開始AI協作開發 🎉**
