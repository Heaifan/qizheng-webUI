# 项目文件树 — 奇正相生 qizheng-webUI v0.6.0 自然战场地貌编辑器

```
qizheng-v0.4.1/
├── index.html              — 应用入口，定义 UI 结构和脚本加载顺序
├── css/
│   └── app.css             — 主样式（压缩单行），响应式全屏布局，桌面/横屏/手机适配
├── js/
│   ├── qzNamespace.js      — QZ 全局命名空间入口（脚本第一加载）
│   ├── prng.js             — 可种子化 LCG PRNG，地图可复现
│   ├── debug.js            — 调试日志面板（固定浮层，日志倒序）
│   ├── main.js             — 启动器 + 主循环 + 地图自检
│   ├── map/
│   │   ├── data/
│   │   │   ├── mapConstants.js — 图层枚举常量 (Natural/Water/Vegetation) + LayerInfo
│   │   │   ├── mapLayers.js    — 三层 + heightMap 数组初始化
│   │   │   ├── mapAccess.js    — 逐层 get/set 访问器 + nearLayer/eachCell + paintCell
│   │   │   ├── heightEdit.js   — 高度编辑：falloff stamp / autoHeight / paintTerrainStamp 图层+高度同步 / syncWaterHeights
│   │   │   └── mapClear.js     — clearAll() 清空所有图层
│   │   ├── render/
│   │   │   ├── drawLayers.js   — 渲染管线编排：8 步分层绘制
│   │   │   ├── drawOverlay.js  — 网格线 + 画笔游标
│   │   │   ├── drawContours.js — 等高线：Marching Squares
│   │   │   └── drawRelief.js   — 地势底色 + 坡度阴影
│   │   ├── forest/
│   │   │   └── forestPatch.js  — 森林斑块生成 (vegetationMap)
│   │   ├── water/
│   │   │   └── riverPath.js    — 河流平滑生成 (waterMap)
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
├── README.md               — 项目说明文档（位于 qizheng-v0.4.1/ 内）
└── （file-tree.md / changelog.md / AI_DEVELOPMENT_RULES 位于仓库顶层）
```

**说明：** 所有 JS 文件均为 IIFE + `window.QZ` 命名空间的纯前端脚本，无框架依赖，通过 `<script>` 标签按序加载。共 23 个 JS 文件。`README.md` 随代码位于 `qizheng-v0.4.1/`，`file-tree.md` / `changelog.md` / `AI_DEVELOPMENT_RULES_兵无常势_玄域引擎.md` 位于仓库顶层。

### 渲染管线（drawMap → renderLayers 8 步 → drawOverlay）

| 序 | 层 | 来源 |
|---|---|---|
| 1 | naturalMap 自然地形 | drawLayers.js |
| 2 | shadeHigh 高地阴影 | drawLayers.js |
| 3 | drawRelief 地势底色+坡影 | drawRelief.js |
| 4 | drawGrid 弱网格（水体之下） | drawLayers.js |
| 5 | drawContours 等高线 | drawContours.js |
| 6 | waterMap 水文 | drawLayers.js |
| 7 | drawShore 水岸线 | drawLayers.js |
| 8 | vegetationMap 植被 | drawLayers.js |
| 9 | overlay 网格线+游标 | drawOverlay.js |

### 约束

- `js/map/` 根目录保持 ≤5 个核心装配文件（当前 3 个）。
- 领域逻辑下沉到子目录（`data/`、`render/`、`landform/`、`forest/`、`water/`）。
- 跨模块基础设施文件位于 `js/` 根目录（如 `prng.js`、`debug.js`）。
- 所有 JS 文件 ≤ 100 行（5+100 红线）。
- 新增/移动文件须同步更新 `file-tree.md` 和 `changelog.md`。
