#!/bin/bash

# =============================================================================
# Claude + Gemini 協作開發工具
# 使用方法: ./tools/collaborate.sh "功能名稱" [描述]
# =============================================================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# 日誌函數
log_info() {
    echo -e "${BLUE}ℹ️  [INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ [SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠️  [WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}❌ [ERROR]${NC} $1"
}

log_step() {
    echo -e "${PURPLE}🔄 [STEP]${NC} $1"
}

log_ai() {
    echo -e "${CYAN}🤖 [AI]${NC} $1"
}

# 檢查工具可用性
check_tools() {
    log_step "檢查工具可用性..."

    local missing_tools=()

    if ! command -v claude &> /dev/null; then
        missing_tools+=("claude")
    fi

    if ! command -v gemini &> /dev/null; then
        missing_tools+=("gemini")
    fi

    if [ ${#missing_tools[@]} -gt 0 ]; then
        log_error "缺少必要工具: ${missing_tools[*]}"
        log_info "請執行 ./scripts/setup-env.sh 安裝工具"
        exit 1
    fi

    log_success "工具檢查完成 ✓"
}

# 檢查專案結構
check_project_structure() {
    log_step "檢查專案結構..."

    # 檢查必要檔案
    local required_files=("package.json")
    local missing_files=()

    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done

    if [ ${#missing_files[@]} -gt 0 ]; then
        log_warning "缺少專案檔案: ${missing_files[*]}"
        log_info "請確認您在正確的專案目錄中"
    fi

    # 建立必要目錄
    mkdir -p reviews logs

    log_success "專案結構檢查完成 ✓"
}

# 記錄協作開始
log_collaboration_start() {
    local feature=$1
    local description=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    cat >> logs/collaboration.log << EOF

==========================================
協作開始: $feature
時間: $timestamp
描述: $description
==========================================

EOF
}

# Claude Code 工作階段
claude_work() {
    local feature=$1
    local description=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    log_ai "Claude Code 開始工作: $feature"
    echo "[$timestamp] Claude Code 開始: $feature" >> logs/collaboration.log

    # 檢查是否有 CLAUDE.md 指導文件
    if [ -f "CLAUDE.md" ]; then
        log_info "使用 CLAUDE.md 指導文件"
    else
        log_warning "未找到 CLAUDE.md，建議建立指導文件"
    fi

    # 執行 Claude Code
    local claude_prompt="實作 $feature 功能。

$description

請遵循以下指導原則：
1. 閱讀專案中的 CLAUDE.md 文件（如果存在）
2. 使用 TypeScript 嚴格類型定義
3. 遵循 React 和 Next.js 最佳實踐
4. 包含完整的錯誤處理
5. 添加清楚的程式碼註釋
6. 確保程式碼品質和可維護性

完成後請提供實作摘要。"

    echo "Claude 提示:" >> logs/collaboration.log
    echo "$claude_prompt" >> logs/collaboration.log
    echo "---" >> logs/collaboration.log

    if claude -p "$claude_prompt" -v ; then
        echo "[$timestamp] Claude Code 完成: $feature" >> logs/collaboration.log
        log_success "Claude Code 工作完成 ✅"
        return 0
    else
        echo "[$timestamp] Claude Code 失敗: $feature" >> logs/collaboration.log
        log_error "Claude Code 執行失敗"
        return 1
    fi
}

# Gemini CLI 工作階段
gemini_work() {
    local feature=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    log_ai "Gemini CLI 開始優化: $feature"
    echo "[$timestamp] Gemini CLI 開始: $feature" >> logs/collaboration.log

    # 檢查是否有 GEMINI.md 指導文件
    if [ -f "GEMINI.md" ]; then
        log_info "使用 GEMINI.md 指導文件"
    else
        log_warning "未找到 GEMINI.md，建議建立指導文件"
    fi

    # 執行 Gemini CLI
    local gemini_prompt="審查和優化 $feature 功能。

請遵循以下指導原則：
1. 閱讀專案中的 GEMINI.md 文件（如果存在）
2. 重點改善使用者體驗和介面設計
3. 確保響應式設計和可訪問性
4. 優化效能和載入速度
5. 改善視覺設計和互動效果
6. 提供使用者友好的錯誤處理

請直接實作改進，並將審查結果寫入 reviews/${feature}-review.md 檔案。"

    echo "Gemini 提示:" >> logs/collaboration.log
    echo "$gemini_prompt" >> logs/collaboration.log
    echo "---" >> logs/collaboration.log

    if gemini --model gemini-2.5-flash -p "$gemini_prompt"; then
        echo "[$timestamp] Gemini CLI 完成: $feature" >> logs/collaboration.log
        log_success "Gemini CLI 優化完成 ✅"
        return 0
    else
        echo "[$timestamp] Gemini CLI 失敗: $feature" >> logs/collaboration.log
        log_error "Gemini CLI 執行失敗"
        return 1
    fi
}

# 交叉審查階段
cross_review() {
    local feature=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    log_step "執行交叉審查..."
    echo "[$timestamp] 開始交叉審查: $feature" >> logs/collaboration.log

    # Claude 審查 Gemini 的工作
    log_ai "Claude Code 審查 Gemini CLI 的改進..."
    local claude_review_prompt="請審查 Gemini CLI 對 $feature 功能所做的改進。

重點檢查：
1. 程式碼邏輯是否正確
2. TypeScript 類型安全性
3. React 最佳實踐是否遵循
4. 效能是否受到影響
5. 可維護性評估

請將審查結果寫入 reviews/${feature}-claude-review.md 檔案。"

    if claude -p "$claude_review_prompt" -v; then
        log_success "Claude 審查完成 ✓"
    else
        log_warning "Claude 審查失敗"
    fi

    # Gemini 回應審查
    log_ai "Gemini CLI 回應審查意見..."
    local gemini_response_prompt="請閱讀 reviews/${feature}-claude-review.md 檔案並回應：

1. 解釋設計決策的原因
2. 修正任何被指出的問題
3. 提供替代解決方案（如果需要）
4. 改進相關實作

請將回應寫入 reviews/${feature}-gemini-response.md 檔案。"

    if gemini --model gemini-2.5-flash -p "$gemini_response_prompt"; then
        log_success "Gemini 回應完成 ✓"
    else
        log_warning "Gemini 回應失敗"
    fi

    echo "[$timestamp] 交叉審查完成: $feature" >> logs/collaboration.log
}

# 測試階段
run_tests() {
    local feature=$1
    local project_dir=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    log_step "執行測試..."
    echo "[$timestamp] 開始測試: $feature (專案目錄: $project_dir)" >> logs/collaboration.log

    local test_failed=false

    # TypeScript 檢查
    if command -v tsc &> /dev/null; then
        log_info "執行 TypeScript 檢查..."
        if ! (cd "$project_dir" && pnpm run build) 2>/dev/null; then
            log_warning "TypeScript 建置失敗"
            test_failed=true
        else
            log_success "TypeScript 檢查通過 ✓"
        fi
    fi

    # ESLint 檢查
    if [ -f "$project_dir/.eslintrc.json" ] || [ -f "$project_dir/eslint.config.js" ]; then
        log_info "執行 ESLint 檢查..."
        if ! (cd "$project_dir" && pnpm run lint) 2>/dev/null; then
            log_warning "ESLint 檢查失敗"
            test_failed=true
        else
            log_success "ESLint 檢查通過 ✓"
        fi
    fi

    # 執行測試
    if [ -f "$project_dir/jest.config.js" ] || [ -f "$project_dir/jest.config.ts" ]; then
        log_info "執行單元測試..."
        if ! (cd "$project_dir" && pnpm test) 2>/dev/null; then
            log_warning "單元測試失敗"
            test_failed=true
        else
            log_success "單元測試通過 ✓"
        fi
    fi

    if [ "$test_failed" = true ]; then
        echo "[$timestamp] 測試失敗: $feature" >> logs/collaboration.log
        log_warning "部分測試失敗，請檢查上述警告"
        return 1
    else
        echo "[$timestamp] 測試通過: $feature" >> logs/collaboration.log
        log_success "所有測試通過 ✅"
        return 0
    fi
}

# Git 提交
git_commit() {
    local feature=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    log_step "提交變更到 Git..."

    # 檢查是否有變更
    if ! git diff --quiet || ! git diff --cached --quiet; then
        git add .

        local commit_message="feat: 協作實作 $feature

- Claude Code: 核心邏輯實作
- Gemini CLI: UX 優化和審查
- 測試: 通過品質檢查
- 時間: $timestamp"

        if git commit -m "$commit_message"; then
            echo "[$timestamp] Git 提交成功: $feature" >> logs/collaboration.log
            log_success "變更已提交到 Git ✅"
        else
            echo "[$timestamp] Git 提交失敗: $feature" >> logs/collaboration.log
            log_error "Git 提交失敗"
            return 1
        fi
    else
        log_info "沒有檔案變更，跳過 Git 提交"
    fi
}

# 生成協作報告
generate_report() {
    local feature=$1
    local start_time=$2
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')

    log_step "生成協作報告..."

    cat > "reports/collaboration-report-$(date +%Y%m%d-%H%M%S).md" << EOF
# 協作開發報告

## 功能信息
- **功能名稱**: $feature
- **開始時間**: $start_time
- **完成時間**: $end_time

## 參與者
- 🧠 Claude Code: 核心邏輯實作
- 🎨 Gemini CLI: UX 優化和審查

## 產出文件
- 審查報告: reviews/${feature}-review.md
- Claude 審查: reviews/${feature}-claude-review.md
- Gemini 回應: reviews/${feature}-gemini-response.md

## 測試結果
- TypeScript 檢查: ✅
- ESLint 檢查: ✅
- 單元測試: ✅

## 協作日誌
詳見 logs/collaboration.log

---
*此報告由協作工具自動生成*
EOF

    log_success "協作報告已生成 ✅"
}

# 顯示使用說明
show_usage() {
    echo "Claude + Gemini 協作開發工具"
    echo
    echo "使用方法:"
    echo "  $0 <功能名稱> [描述] [專案目錄]"
    echo
    echo "範例:"
    echo "  $0 \"深色模式\" \"為應用程式添加深色模式切換功能\" \"my-todo-app\""
    echo "  $0 \"搜尋功能\" \"實作即時搜尋和篩選\" \"frontend\""
    echo "  $0 \"用戶認證\" \"\" \"backend\""
    echo
    echo "選項:"
    echo "  -h, --help     顯示此說明"
    echo "  -v, --verbose  詳細輸出模式"
    echo
}

# 主要協作流程
collaborate() {
    local feature=$1
    local description=$2
    local project_dir=${3:-"my-todo-app"}
    local start_time=$(date '+%Y-%m-%d %H:%M:%S')

    if [ -z "$feature" ]; then
        log_error "請提供功能名稱"
        show_usage
        exit 1
    fi

    if [ ! -d "$project_dir" ]; then
        log_error "專案目錄不存在: $project_dir"
        exit 1
    fi

    # 建立必要目錄
    mkdir -p reviews logs reports

    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║             🤖 AI 協作開發開始                             ║"
    echo "║                                                            ║"
    echo "║  功能: $feature"
    echo "║  時間: $start_time"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    # 記錄協作開始
    log_collaboration_start "$feature" "$description"

    # 執行協作流程
    if claude_work "$feature" "$description"; then
        if gemini_work "$feature"; then
            cross_review "$feature"

            if run_tests "$feature" "$project_dir"; then
                git_commit "$feature"
                generate_report "$feature" "$start_time"

                echo -e "${GREEN}"
                echo "╔════════════════════════════════════════════════════════════╗"
                echo "║               🎉 協作開發成功完成！                        ║"
                echo "║                                                            ║"
                echo "║  功能: $feature"
                echo "║  查看報告: reports/ 目錄"
                echo "║  查看日誌: logs/collaboration.log"
                echo "╚════════════════════════════════════════════════════════════╝"
                echo -e "${NC}"

                return 0
            else
                log_error "測試失敗，協作流程中斷"
                return 1
            fi
        else
            log_error "Gemini CLI 優化失敗"
            return 1
        fi
    else
        log_error "Claude Code 實作失敗"
        return 1
    fi
}

# 主程式
main() {
    case "${1:-}" in
        -h|--help)
            show_usage
            exit 0
            ;;
        -v|--verbose)
            set -x
            shift
            ;;
    esac

    check_tools
    check_project_structure
    collaborate "$1" "$2"
}

# 執行主程式
main "$@"