#!/bin/bash

# =============================================================================
# Claude + Gemini 協作開發環境自動設定腳本
# =============================================================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

# 顯示歡迎訊息
show_welcome() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║          Claude + Gemini 協作開發環境設定                   ║"
    echo "║                                                            ║"
    echo "║  此腳本將幫您安裝和設定所有必要的工具                         ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# 檢查系統需求
check_system_requirements() {
    log_step "檢查系統需求..."

    # 檢查 Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安裝。請前往 https://nodejs.org 下載安裝 LTS 版本"
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE_VERSION="18.0.0"

    if ! [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE_VERSION" ]; then
        log_error "Node.js 版本過舊。需要 v18+ ，目前版本: v$NODE_VERSION"
        exit 1
    fi

    log_success "Node.js v$NODE_VERSION ✓"

    # 檢查作業系統
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="Linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macOS"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        OS="Windows"
    else
        log_warning "未知的作業系統: $OSTYPE"
        OS="Unknown"
    fi

    log_success "作業系統: $OS ✓"
}

# 安裝 pnpm
install_pnpm() {
    log_step "安裝 pnpm..."

    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        log_success "pnpm v$PNPM_VERSION 已安裝 ✓"
        return
    fi

    log_info "正在安裝 pnpm..."
    npm install -g pnpm

    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        log_success "pnpm v$PNPM_VERSION 安裝成功 ✅"
    else
        log_error "pnpm 安裝失敗"
        exit 1
    fi
}

# 安裝 AI 工具
install_ai_tools() {
    log_step "安裝 AI 工具..."

    # 安裝 Gemini CLI
    log_info "安裝 Gemini CLI..."
    if command -v gemini &> /dev/null; then
        log_success "Gemini CLI 已安裝 ✓"
    else
        pnpm install -g @google/gemini-cli
        if command -v gemini &> /dev/null; then
            log_success "Gemini CLI 安裝成功 ✅"
        else
            log_error "Gemini CLI 安裝失敗"
        fi
    fi

    # 安裝 Claude Code
    log_info "安裝 Claude Code..."
    if command -v claude &> /dev/null; then
        log_success "Claude Code 已安裝 ✓"
    else
        pnpm install -g @anthropic-ai/claude-code
        if command -v claude &> /dev/null; then
            log_success "Claude Code 安裝成功 ✅"
        else
            log_warning "Claude Code 安裝失敗（可能需要手動設定 API 金鑰）"
        fi
    fi
}

# 設定專案權限
setup_permissions() {
    log_step "設定腳本執行權限..."

    # 設定工具腳本權限
    if [ -d "tools" ]; then
        chmod +x tools/*.sh
        log_success "工具腳本權限設定完成 ✓"
    fi

    # 設定其他腳本權限
    if [ -d "scripts" ]; then
        chmod +x scripts/*.sh
        log_success "腳本權限設定完成 ✓"
    fi
}

# 建立必要目錄
create_directories() {
    log_step "建立專案目錄結構..."

    directories=(
        "examples"
        "templates"
        "tools"
        "scripts"
        "docs"
        "assets/images"
        "assets/videos"
        "assets/diagrams"
    )

    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            mkdir -p "$dir"
            log_info "建立目錄: $dir"
        fi
    done

    log_success "目錄結構建立完成 ✓"
}

# 初始化範例專案
setup_example_project() {
    log_step "設定範例專案..."

    if [ ! -d "examples/todo-app" ]; then
        log_info "建立 Todo App 範例專案..."
        mkdir -p examples/todo-app

        # 複製範例專案結構
        cat > examples/todo-app/package.json << 'EOF'
{
  "name": "todo-app-example",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest --passWithNoTests"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

        log_success "範例專案結構建立完成 ✓"
    else
        log_success "範例專案已存在 ✓"
    fi
}

# 驗證安裝
validate_installation() {
    log_step "驗證安裝..."

    local errors=0

    # 檢查 pnpm
    if ! command -v pnpm &> /dev/null; then
        log_error "pnpm 未正確安裝"
        ((errors++))
    fi

    # 檢查 Gemini CLI
    if ! command -v gemini &> /dev/null; then
        log_error "Gemini CLI 未正確安裝"
        ((errors++))
    fi

    # 檢查 Claude Code（可選）
    if ! command -v claude &> /dev/null; then
        log_warning "Claude Code 未安裝（需要 API 金鑰）"
    fi

    if [ $errors -eq 0 ]; then
        log_success "所有必要工具安裝成功 ✅"
        return 0
    else
        log_error "發現 $errors 個安裝問題"
        return 1
    fi
}

# 顯示後續步驟
show_next_steps() {
    echo -e "${CYAN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    🎉 設定完成！                           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    echo -e "${GREEN}📚 接下來的步驟：${NC}"
    echo
    echo -e "${YELLOW}1. 認證 AI 工具：${NC}"
    echo "   gemini \"Hello\"  # Gemini CLI（免費）"
    echo "   claude config set api-key YOUR_KEY  # Claude Code（付費）"
    echo
    echo -e "${YELLOW}2. 開始學習：${NC}"
    echo "   pnpm run docs:dev  # 啟動文檔伺服器"
    echo "   open http://localhost:8000"
    echo
    echo -e "${YELLOW}3. 試用範例：${NC}"
    echo "   pnpm run example:install  # 安裝範例專案依賴"
    echo "   pnpm run example:dev      # 啟動範例專案"
    echo
    echo -e "${YELLOW}4. 建立新專案：${NC}"
    echo "   pnpm run new-project my-app  # 建立新的協作專案"
    echo
    echo -e "${BLUE}💡 提示：所有指令都可以在專案根目錄執行${NC}"
}

# 主要執行流程
main() {
    show_welcome

    check_system_requirements
    install_pnpm
    install_ai_tools
    setup_permissions
    create_directories
    setup_example_project

    if validate_installation; then
        show_next_steps
        exit 0
    else
        log_error "設定過程中發現問題，請檢查上述錯誤訊息"
        exit 1
    fi
}

# 執行主程式
main "$@"