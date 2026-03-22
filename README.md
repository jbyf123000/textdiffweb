# TextDiff 在线文本对比

一个可通过 Docker 一键部署的在线文本差异对比工具，界面参考你给的截图，打开页面后就能直接粘贴左右文本进行比对。

## 功能

- 左右文本差异对比，支持行号和高亮
- 支持宽屏左右布局，窄屏自动切换为上下布局
- 支持交换左右内容、清空、恢复示例
- 支持复制左右文本
- 提供 VS Code `F5` 调试配置
- 支持 Docker 一键部署
- 提供一键下载并启动脚本

## 本地开发

```bash
npm install
npm run dev
```

默认开发地址通常是 `http://localhost:5173`。

## VS Code 调试

项目已内置 `.vscode/launch.json` 和 `.vscode/tasks.json`。

在 VS Code 中打开项目后可直接按：

```text
F5
```

即可自动启动 Vite 开发服务并打开浏览器调试页面。

## Docker 部署

```bash
docker compose up -d --build
```

启动后访问：

```text
http://localhost:8080
```

## 一键下载并启动

Windows 下可直接双击：

```text
quick-start.bat
```

或者在 PowerShell 中运行：

```powershell
.\quick-start.ps1
```

Linux / macOS 可运行：

```bash
bash ./quick-start.sh
```

脚本会自动执行以下流程：

- 如果当前目录就是项目仓库，先拉取最新代码
- 如果当前目录没有项目代码，自动从 GitHub 下载
- 自动执行 `docker compose up -d --build`
- 启动完成后访问 `http://localhost:8080`

## 停止服务

```bash
docker compose down
```

## 仓库地址

```text
https://github.com/jbyf123000/textdiffweb.git
```

## 项目结构

- `src/App.jsx`：主界面和交互逻辑
- `src/App.css`：页面样式
- `.vscode/`：VS Code 调试配置
- `Dockerfile`：生产镜像构建
- `docker-compose.yml`：一键启动配置
- `nginx.conf`：静态资源服务配置
- `quick-start.*`：一键下载和 Docker 启动脚本
