# 奇正相生 qizheng-webUI v0.6.0 自然战场地貌编辑器

**定位：** 自然战场地貌编辑器原型——负责地形、地貌、植被、水文四类自然要素的编辑与表达，为班组~团级推演提供比例尺无关的底图。属《兵无常势》前置验证原型（奇正相生体系）。

## 使用

直接用浏览器打开 `index.html` 即可运行；也可以用 VS Code Live Server 或任意静态服务器预览。无构建步骤。

## 当前功能

- **三层地图模型**：自然地形（草地/高地/泥地）、水文（河流/湖泊）、植被（森林/灌木）+ `heightMap` 高度图，分层独立存储与渲染。
- **地貌编辑器**：5 种地貌笔刷（山地/盆地/高原/山谷/平滑）通过 `heightMap` 改变地势，`naturalMap` 自动派生；另有 4 种地表笔刷（草地/高地/水面/树林）直接写层。
- **随机生成**：高度图（正弦波叠加）、高地（8%~18% 动态阈值）、河流（Chaikin 平滑 + 限弯 + 宽度渐变）、森林斑块（中心扩散 + 边缘衰减）。
- **地势表达**：高度底色（低冷暗/高暖亮）+ 坡度阴影 + 等高线（Marching Squares，可开关）+ 高地阴影。
- **可复现**：内置种子化 LCG PRNG，状态栏显示 Seed 值。
- **比例尺无关**：地图只保存地形关系，格距（1 格 = 1m/5m/20m/50m）由推演场景配置决定。

## 渲染管线

`drawMap()` → `renderLayers()` 8 步分层绘制 → `drawOverlay()` 最上层。

| 序 | 层 | 内容 | 来源 |
|---|---|---|---|
| 1 | naturalMap | 自然地形（草地/高地/泥地） | drawLayers.js |
| 2 | shadeHigh | 高地高亮阴影（heightMap > 0.55） | drawLayers.js |
| 3 | drawRelief | 地势底色 + 坡度阴影 | drawRelief.js |
| 4 | drawGrid | 弱网格（每 4 格主网格，位于水体之下） | drawLayers.js |
| 5 | drawContours | 等高线（Marching Squares，可开关） | drawContours.js |
| 6 | waterMap | 水文（河流/湖泊） | drawLayers.js |
| 7 | drawShore | 水岸线（水陆过渡） | drawLayers.js |
| 8 | vegetationMap | 植被（森林/灌木） | drawLayers.js |
| 9 | overlay | 网格线 + 画笔游标 | drawOverlay.js |

## 目录

```txt
index.html                  — 应用入口，定义 UI 结构和脚本加载顺序
css/app.css                 — 主样式（压缩单行），响应式全屏布局，桌面/横屏/手机适配
js/qzNamespace.js           — QZ 全局命名空间入口（脚本第一加载）
js/prng.js                  — 可种子化 LCG PRNG，地图可复现
js/debug.js                 — 调试日志面板（固定浮层，日志倒序）
js/main.js                  — 启动器 + 主循环 + 地图自检
js/map/data/mapConstants.js — 图层枚举常量 (Natural/Water/Vegetation) + LayerInfo
js/map/data/mapLayers.js    — 三层 + heightMap 数组初始化
js/map/data/mapAccess.js    — 逐层 get/set 访问器 + nearLayer/eachCell + paintCell
js/map/data/heightEdit.js   — 高度编辑：falloff stamp / autoHeight / paintTerrainStamp 图层+高度同步 / syncWaterHeights
js/map/data/mapClear.js     — clearAll() 清空所有图层
js/map/render/drawLayers.js — 渲染管线编排：8 步分层绘制
js/map/render/drawOverlay.js — 网格线 + 画笔游标
js/map/render/drawContours.js — 等高线：Marching Squares
js/map/render/drawRelief.js   — 地势底色 + 坡度阴影
js/map/landform/landformCore.js    — 地貌笔刷核心：falloff / 距离 / stamp
js/map/landform/landformBrushes.js — 5 种地貌笔刷：山地/盆地/高原/山谷/平滑
js/map/landform/deriveTerrain.js   — 根据 heightMap 自动派生 naturalMap
js/map/forest/forestPatch.js  — 森林斑块生成 (vegetationMap)
js/map/water/riverPath.js     — 河流平滑生成 (waterMap)
js/map/mapDraw.js          — 渲染编排：resizeCanvas + computeCellLayout + drawMap
js/map/mapBrush.js         — 画笔交互：pointer→格子、分层写入、事件绑定
js/map/mapRandom.js        — 随机地图生成：高度图/高地/河流/森林/装饰
js/ui/uiState.js           — 状态管理：模式、地形、笔刷、种子、FPS、状态栏文本
js/ui/uiControls.js        — UI 按钮事件绑定：地形选择、模式切换、笔刷、清空、随机
```

**说明：** 所有 JS 文件均为 IIFE + `window.QZ` 命名空间的纯前端脚本，无框架依赖，通过 `<script>` 标签按序加载。共 23 个 JS 文件。

## 约束

- `js/map/` 根目录保持 ≤5 个核心装配文件（当前 3 个）。
- 领域逻辑下沉到子目录（`data/`、`render/`、`landform/`、`forest/`、`water/`）。
- 跨模块基础设施文件位于 `js/` 根目录（如 `prng.js`、`debug.js`）。
- 所有 JS 文件 ≤100 行（5+100 红线）。
- 新增/移动文件须同步更新 `file-tree.md` 和 `changelog.md`。

## 未来扩展位

- 道路/桥梁/村庄/工事等人造物层设计已保留，待 v1.x 阶段叠加。
