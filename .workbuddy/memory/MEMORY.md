# 奇正相生项目（qizheng）长期记忆

## 项目双线定性（2026-07-08 用户确认）
- 旧版本：Vue / Pinia / Electron / TypeScript 战斗原型（qi-zheng-interplay 仓库）
- 新版本：纯 HTML / 原生 JS / Canvas 地貌编辑器原型（qizheng-mvp-pc-v0.3 目录，即当前工作区）
- ⚠️ 当前工作区 = 新版本本体。不要切回 Vue 旧线。
- 当前目标：让纯 HTML 版本成为新的轻量 MVP，立稳再迭代。

## 架构（新版本）
- 无构建工具，14 个 <script> 顺序加载，window.QZ 全局命名空间，ES5(var)
- 4 目录 × 5 文件：src(基础设施)/map(地图)/ui(界面)/input(输入)
- 地图 320×512=163840 格，4px/格，Uint8Array 地形；离屏 terrainCanvas 缓存 + 主 canvas 视口裁剪
- 双模式：画笔(Bresenham+方形笔刷) / 拖图(平移相机)；Pointer Events 触屏友好

## 待修问题（已确认，优先级 P0>P1>P2）
- P0：index.html 与 style.css class 名不匹配（HTML: brand/canvas-wrap/toolbar/section-title/button-row/terrain-dot；CSS: title/canvasWrap/groupTitle/btnGrid/dot），且布局结构也未对齐 → 样式大面积失效。修：以 HTML 为准改 CSS，不大改 JS。
- P1：QZ.fuc_getLayoutName 在 uiLayout.js(三态 竖屏/平板/横屏) 与 uiText.js(误用 isPortrait) 重复定义，后者覆盖。修：删 uiText.js 版本，uiLayout.js 为唯一来源。
- P2：拖图模式 lastCell/lastPaintCell 不更新，格坐标显示停在旧值。体验问题，后修。

## 推进路线 R1/R2/R3
- R1 新版本基线：【已收口】git init + 接 GitHub 远程(SSH) + file-tree.md + changelog.md + README 补注 + tag v0.3.0-R1（commit 9952b6）+ 已 `git push -u origin main --tags` 上远程成功（沙箱复用本机 id_ed25519 经 SSH 自动推送）。
- R2 首屏布局：以 index.html 为准改 style.css，不大改 JS，保证手机竖屏/电脑横屏，Canvas 不塌陷
- R3 状态与交互：合并 getLayoutName、删重复、修拖图格信息、手机端触屏测试
- 原则：先给计划不直接改代码；单文件 ≤100 行，超则拆分

## 红线（沿用用户约定）
- 单文件 ≤100 行；单目录核心文件 ≤5 个；SRP；禁用 Manager/Helper/Utils 命名
- 每次改动 commit + push
- 磁盘目录名：qi-zheng-interplay（连字符）
- **Git 凭证红线**：绝不索要/接收 Token/PAT 等明文凭证；但沙箱复用用户本机已有 SSH 密钥（~/.ssh/id_ed25519，已配 GitHub）经 SSH 协议自动 push 是允许的（用户要求"自动 push 不要每次手动"）。
