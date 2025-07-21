# 🚀 AI 協作開發專案 - Claude Code × Gemini CLI

一個展示如何使用 Claude Code 和 Gemini CLI 兩個 AI 助手協作開發現代 Web 應用程式的完整專案。

## 📖 專案概述

這是一個功能完整的 Todo 應用程式，展示了 AI 協作開發的最佳實踐。透過 Claude Code 的邏輯實作能力和 Gemini CLI 的使用者體驗優化，我們建立了一個具有現代設計和豐富功能的應用程式。

### ✨ 主要特色

* 🤖 **雙 AI 協作模式**：Claude Code 負責邏輯，Gemini CLI 負責體驗
* 🛠️ **現代技術棧**：Next.js 15 + TypeScript + TailwindCSS + shadcn/ui
* ⚡ **完整協作工具**：618 行協作腳本，支援中斷恢復和自動測試
* 📚 **詳細教學文件**：從零開始的完整學習指南
* 🎯 **實用功能齊全**：深色模式、鍵盤快捷鍵、響應式設計

## 🏗️ 專案結構

```
vibe-claude-gemini/
├── tools/                    # AI 協作工具
│   ├── collaborate.sh       # 主要協作腳本 (618行)
│   ├── collaborate.config   # 協作配置
│   └── prompts.conf         # 提示詞模板
├── my-todo-app/             # Next.js 應用程式
│   ├── src/
│   │   ├── app/            # Next.js 15 App Router
│   │   ├── components/     # React 組件
│   │   ├── context/        # React Context
│   │   ├── hooks/          # 自定義 Hooks
│   │   ├── types/          # TypeScript 類型
│   │   └── lib/            # 工具函數
│   └── package.json
├── reports/                 # 協作報告（自動生成）
├── reviews/                 # 程式碼審查記錄
├── docs/                    # 教學文件和圖片
├── CLAUDE.md               # Claude 工作指南
├── GEMINI.md               # Gemini 工作指南
└── tutorial-beginners.md   # 完整初學者教學
```

## 🎯 已實作功能

### 核心功能

* ✅ 新增、編輯、刪除待辦事項
* ✅ 標記完成/未完成狀態
* ✅ 篩選功能（全部/進行中/已完成）
* ✅ 即時搜尋功能
* ✅ 資料本地持久化（localStorage）

### 進階功能

* ✅ 深色模式切換（淺色/深色/系統自動）
* ✅ 完整鍵盤快捷鍵系統（8 個快捷鍵）
* ✅ 空狀態設計（動畫 + 情境提示）
* ✅ 快捷鍵說明面板
* ✅ 完全響應式設計（手機/平板/桌面）
* ✅ 無障礙設計支援

### 技術特色

* ✅ TypeScript 嚴格類型檢查
* ✅ Framer Motion 流暢動畫
* ✅ shadcn/ui 現代組件庫
* ✅ ESLint 程式碼品質檢查
* ✅ 完整錯誤處理機制

## 🚀 快速開始

### 1. 環境需求

```bash
# 安裝 Node.js 18+ 和 pnpm
npm install -g pnpm

# 安裝 AI 工具
pnpm install -g @anthropic-ai/claude-code  # 需付費
pnpm install -g @google/gemini-cli         # 免費
```

### 2. 專案設定

```bash
# 複製專案
git clone https://github.com/qwedsazxc78/vibe-claude-gemini.git
cd vibe-claude-gemini

# 進入應用目錄
cd my-todo-app

# 安裝依賴
pnpm install

# 啟動開發伺服器
pnpm dev
```

### 3. AI 工具設定

```bash
# 設定 Claude Code API Key
claude config set api-key YOUR_API_KEY

# 登入 Gemini CLI
gemini "Hello"  # 會開啟瀏覽器登入
```

## 📚 學習資源

### 🎓 初學者教學

請參閱 [ `tutorial-beginners.md` ](./tutorial-beginners.md) 獲得完整的學習指南，包含：

* **Part 1**: 快速環境設定
* **Part 2**: Claude Code 核心實作
* **Part 3**: Gemini CLI 美化與優化
* **Part 4**: AI 協作精髓

### 🛠️ 協作工具使用

使用我們的進階協作腳本：

```bash
# 基本使用
./tools/collaborate.sh "功能名稱" "功能描述" "專案目錄"

# 實際範例
./tools/collaborate.sh "深色模式" "新增深色模式切換功能" "my-todo-app"
```

**腳本特色**：
* 🔄 中斷恢復機制
* 🔍 自動品質檢查
* 📝 詳細協作報告
* 🤝 AI 交叉審查

## ⌨️ 鍵盤快捷鍵

| 快捷鍵 | 功能 | 類別 |
|--------|------|------|
| `Ctrl+N` | 新增待辦事項 | 編輯 |
| `Ctrl+F` | 搜尋待辦事項 | 導航 |
| `Ctrl+T` | 切換主題 | 主題 |
| `Shift+?` | 顯示快捷鍵幫助 | 協助 |
| `Ctrl+1` | 顯示全部項目 | 篩選 |
| `Ctrl+2` | 顯示進行中項目 | 篩選 |
| `Ctrl+3` | 顯示已完成項目 | 篩選 |
| `Escape` | 清空搜尋 | 導航 |

## 🧪 測試和建置

```bash
# 進入應用目錄
cd my-todo-app

# 類型檢查
pnpm run type-check

# 程式碼檢查
pnpm run lint

# 建置應用
pnpm run build

# 啟動生產版本
pnpm start
```

## 📊 專案統計

* **程式碼行數**：~3, 000+ 行 TypeScript/TSX
* **組件數量**：15+ React 組件
* **自定義 Hooks**：3 個專用 Hooks
* **協作腳本**：618 行完整自動化工具
* **教學文件**：880+ 行詳細指南

## 🤝 AI 協作模式

### Claude Code 負責領域

* 🧠 程式邏輯和架構設計
* 📝 TypeScript 類型定義
* ⚙️ 狀態管理和資料流
* 🔧 錯誤處理和效能優化

### Gemini CLI 負責領域

* 🎨 UI/UX 設計和視覺優化
* 📱 響應式設計和互動體驗
* ✨ 動畫效果和微互動
* ♿ 可訪問性和使用者友好性

## 🎯 最佳實踐展示

### 技術實踐

* **類型安全**：100% TypeScript 覆蓋
* **元件化**：可重用組件架構
* **狀態管理**：Context + useReducer 模式
* **效能優化**：React.memo 和 lazy loading

### 協作實踐

* **明確分工**：AI 各司其職
* **交叉審查**：互相檢查程式碼品質
* **自動化流程**：腳本化協作過程
* **文件驅動**：詳細記錄和指南

## 🚀 部署

### Vercel 部署（推薦）

```bash
# 安裝 Vercel CLI
pnpm i -g vercel

# 部署
cd my-todo-app
vercel
```

## 🤖 關於 AI 協作

這個專案展示了 AI 協作開發的巨大潛力：

* **效率提升**：開發速度提升 3-5 倍
* **品質保證**：雙重審查減少錯誤
* **學習加速**：觀察 AI 最佳實踐
* **創意激發**：不同 AI 的獨特視角

## 📝 授權

MIT License - 請參閱 [LICENSE](LICENSE) 檔案

## 🙏 連結

* [Claude Code](https://claude.ai/code) - 程式邏輯實作
* [Gemini CLI](https://ai.google.dev/gemini-api) - 使用者體驗優化
* [Next.js](https://nextjs.org/) - React 框架
* [shadcn/ui](https://ui.shadcn.com/) - UI 組件庫
* [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📞 聯繫

如有問題或建議，歡迎：

* 開啟 [Issue](https://github.com/qwedsazxc78/vibe-claude-gemini/issues)
* 提交 [Pull Request](https://github.com/qwedsazxc78/vibe-claude-gemini/pulls)
* 查閱完整教學文件：[`tutorial-beginners.md`](./tutorial-beginners.md)

---

**🌟 如果這個專案對你有幫助，請給個 Star！**

*展示 AI 協作開發的無限可能 🚀*
