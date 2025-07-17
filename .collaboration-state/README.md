# 協作狀態檔案說明

這個目錄包含協作工具的狀態檔案，用於追蹤和恢復中斷的協作任務。

## 檔案格式

每個狀態檔案都是 JSON 格式，包含以下欄位：

```json
{
    "feature": "功能名稱",
    "current_step": "當前步驟",
    "status": "狀態",
    "timestamp": "時間戳記",
    "additional_data": "額外資料"
}
```

## 步驟說明

可能的步驟值：
- `claude_work`: Claude Code 實作階段
- `gemini_work`: Gemini CLI 優化階段
- `cross_review`: 交叉審查階段
- `run_tests`: 測試執行階段
- `git_commit`: Git 提交階段

## 狀態說明

可能的狀態值：
- `in_progress`: 進行中
- `completed`: 已完成
- `failed`: 失敗
- `skipped`: 已跳過

## 使用方式

當執行 `collaborate.sh` 時，如果發現有未完成的任務，會提示是否要繼續。

## 清理

成功完成的任務會自動清除狀態檔案。如需手動清理，可以直接刪除對應的 `.state` 檔案。