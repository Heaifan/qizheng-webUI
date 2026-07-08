# 变更记录 (changelog)

## v0.3.0-R1 (2026-07-08) —— 新版本基线
- 确立项目定性：当前目录 = 纯 HTML / 原生 JS / Canvas 地貌编辑器原型（新版本线）
  - 旧版本线为 qizheng-interplay（Vue / Pinia / Electron / TypeScript 战斗原型），勿混淆
- git 初始化并接入 GitHub 远程：https://github.com/Heaifan/qizheng-webUI
- 新增 file-tree.md：4 目录 × 5 文件树与职责
- 新增 changelog.md：变更记录起点
- README 补注：本目录为纯 HTML 新版本线
- 新增 .gitignore：忽略系统 / 编辑器 / 日志类文件
- 已知待修（纳入 R2 / R3）：
  - P0：index.html 与 style.css class 名不匹配，样式大面积失效
  - P1：QZ.fuc_getLayoutName 在 uiLayout.js / uiText.js 重复定义
  - P2：拖图模式格坐标显示不更新
