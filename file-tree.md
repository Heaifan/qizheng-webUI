# 项目文件树 — 奇正相生 qizheng-interplay v0.5.0 地貌笔刷重构版

```
qizheng-v0.4.1/
├── index.html              — 应用入口，定义 UI 结构和脚本加载顺序
├── css/
│   └── app.css             — 主样式，响应式布局，桌面/横屏/手机适配
├── js/
│   ├── qzNamespace.js      — QZ 全局命名空间入口（脚本第一加载）
│   ├── prng.js             — 可种子化伪随机数生成器 (LCG)，地图可复现
│   ├── main.js             — 启动器 + 主循环，初始化、绑定控件、启动自检
│   ├── map/
│   │   ├── data/
│   │   │   ├── mapConstants.js — 图层枚举常量 (Natural/Water/Vegetation)
│   │   │   ├── mapLayers.js    — 3 层 + heightMap 数组初始化
│   │   │   ├── mapAccess.js    — 逐层 get/set 访问器 + nearLayer + eachCell
│   │   │   ├── heightEdit.js   — 手绘高度同步：圆形 falloff stamp / autoHeight
│   │   │   └── mapClear.js     — clearAll() 清空所有图层
│   │   ├── render/
│   │   │   ├── drawLayers.js   — 渲染管线：5 层按序绘制 + 高地阴影 + 地势底色/坡影 + 等高线
│   │   │   ├── drawOverlay.js  — 网格线 + 画笔游标
│   │   │   ├── drawContours.js — 等高线辅助层：6 档动态 Marching Squares 等值线
│   │   │   └── drawRelief.js   — 地势底色 + 坡度阴影：低处冷暗/高处暖亮/坡面阴影
│   │   ├── forest/
│   │   │   └── forestPatch.js  — 森林斑块生成 (vegetationLayer)
│   │   ├── water/
│   │   │   └── riverPath.js    — 河流平滑生成 (waterLayer)
│   │   ├── landform/
│   │   │   ├── landformCore.js    — 地貌笔刷核心：falloff / 距离 / stamp
│   │   │   ├── landformBrushes.js — 5 种地貌笔刷：山地/盆地/高原/山谷/平滑
│   │   │   └── deriveTerrain.js   — 根据 heightMap 自动派生 naturalMap
│   │   ├── mapBrush.js     — 画笔交互：pointer→格子、分层写入、事件绑定
│   │   ├── mapDraw.js      — 渲染编排：resizeCanvas + computeCellLayout + drawMap
│   │   └── mapRandom.js    — 随机地图生成：高度图/高地/河流/森林/装饰
│   └── ui/
│       ├── uiControls.js   — UI 按钮事件绑定：地形选择、模式切换、笔刷、清空、随机
│       └── uiState.js      — 状态管理：模式、地形、笔刷、种子、FPS、状态栏文本
├── README.md               — 项目说明文档
├── file-tree.md            — 本文件，项目文件树与功能说明
└── changelog.md            — 变更日志
```

**说明：** 所有 JS 文件均为 IIFE + `window.QZ` 命名空间的纯前端脚本，无框架依赖，通过 `<script>` 标签按序加载。

### 约束

- `js/map/` 根目录保持 ≤5 个核心装配文件（当前 3 个）。
- 领域逻辑下沉到子目录（`data/`、`render/`、`forest/`、`water/`）。
- 跨模块基础设施文件位于 `js/` 根目录（如 `prng.js`）。
- 所有 JS 文件 ≤ 100 行。
- 新增/移动文件须同步更新 `file-tree.md` 和 `changelog.md`。
