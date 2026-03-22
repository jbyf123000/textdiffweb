#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/jbyf123000/textdiffweb.git"
PROJECT_NAME="textdiffweb"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

if [[ ! -f "$PROJECT_ROOT/docker-compose.yml" ]]; then
  PROJECT_ROOT="$SCRIPT_DIR/$PROJECT_NAME"
fi

echo
echo "== TextDiff Docker Quick Start =="
echo

if ! command -v git >/dev/null 2>&1; then
  echo "未检测到 git，请先安装 Git。"
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "未检测到 docker，请先安装并启动 Docker。"
  exit 1
fi

if [[ -d "$PROJECT_ROOT/.git" ]]; then
  echo "检测到本地仓库，开始更新代码..."
  git -C "$PROJECT_ROOT" pull --ff-only
else
  mkdir -p "$PROJECT_ROOT"

  if [[ ! -f "$PROJECT_ROOT/docker-compose.yml" ]]; then
    echo "开始下载项目代码..."
    git clone "$REPO_URL" "$PROJECT_ROOT"
  fi
fi

echo "开始构建并启动 Docker 服务..."
docker compose -f "$PROJECT_ROOT/docker-compose.yml" up -d --build

echo
echo "服务已启动："
echo "http://localhost:8080"
echo
