$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/jbyf123000/textdiffweb.git"
$ProjectName = "textdiffweb"
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = $ScriptRoot

if (-not (Test-Path (Join-Path $ProjectRoot "docker-compose.yml"))) {
  $ProjectRoot = Join-Path $ScriptRoot $ProjectName
}

function Test-Command {
  param([string]$Name)

  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Host ""
Write-Host "== TextDiff Docker 一键启动 ==" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Command "git")) {
  Write-Error "未检测到 git，请先安装 Git。"
}

if (-not (Test-Command "docker")) {
  Write-Error "未检测到 docker，请先安装并启动 Docker Desktop。"
}

if (Test-Path (Join-Path $ProjectRoot ".git")) {
  Write-Host "检测到本地仓库，开始更新代码..." -ForegroundColor Yellow
  git -C $ProjectRoot pull --ff-only
} else {
  if (-not (Test-Path $ProjectRoot)) {
    New-Item -ItemType Directory -Path $ProjectRoot | Out-Null
  }

  if (-not (Test-Path (Join-Path $ProjectRoot "docker-compose.yml"))) {
    Write-Host "开始下载项目代码..." -ForegroundColor Yellow
    git clone $RepoUrl $ProjectRoot
  }
}

Write-Host "开始构建并启动 Docker 服务..." -ForegroundColor Yellow
docker compose -f (Join-Path $ProjectRoot "docker-compose.yml") up -d --build

Write-Host ""
Write-Host "服务已启动：" -ForegroundColor Green
Write-Host "http://localhost:8080" -ForegroundColor Green
Write-Host ""
