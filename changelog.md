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

## v0.3.0-R2 (2026-07-08) —— 首屏布局修复 (P0)
- 以 index.html（header/main/footer 垂直结构）为准重写 style.css，修复 class 名不匹配
  - `.app`→`#app`、`.title`→`.brand`、`.main`+`.canvasWrap`→`.canvas-wrap`(加 flex:1 撑高)、`.groupTitle`→`.section-title`、`.btnGrid`→`.button-row`、`.dot`→`.terrain-dot`
  - 删除无效的 `.panel`/`.group` 侧栏方案
  - 新增 `.toolbar`（footer 容器）+ 媒体查询（窄屏 ≤560px 转 column，防挤压）
- 结果：Canvas 不再塌陷；手机竖屏 / 电脑横屏均正常；按钮与地形色点样式生效；无横向溢出
- 未改动 index.html 与任何 JS（渲染 / 地图逻辑不动）
- 关闭 P0；P1/P2 留待 R3/R4
