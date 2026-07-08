# 变更日志 — 奇正相生 qizheng-webUI

## V0.0.0.17 | 2026-07-08 15:13:18

**v0.6.0-R1 文档收口补丁。** 只修正文档与结构说明，使项目说明与真实代码一致，不新增功能，不改地图生成算法，不改渲染效果。

### 修改

1. **README 版本落后**：标题从 v0.4.3-F 更新为 v0.6.0；定位改为"自然战场地貌编辑器原型"；补充地貌编辑器（5 种地貌笔刷）功能说明；渲染顺序表按 `drawLayers.js` 实际顺序重写（弱网格移至水体之下、等高线之前；补 drawShore 水岸线）；目录补全 23 个 JS 文件含 `debug.js` / `heightEdit.js` / `landform/*`。
2. **file-tree.md 缺 debug.js**：补入 `js/debug.js`；各模块职责描述与实际代码核对（`paintTerrainStamp`/`syncWaterHeights` 归 `heightEdit.js`，`paintCell` 归 `mapAccess.js`）；新增渲染管线表；标注 `css/app.css` 为压缩单行格式。
3. **渲染顺序文档与代码不同步**：按 `drawLayers.js` 实际 `renderLayers` 顺序重写（naturalMap → shadeHigh → drawRelief → drawGrid → drawContours → waterMap → drawShore → vegetationMap → overlay）。

### 涉及文件

- `qizheng-v0.4.1/README.md` — 版本/定位/渲染顺序/目录全面更新
- `file-tree.md`（顶层）— 补 debug.js + 渲染管线表 + 模块职责核对 + 文档位置说明

### 不涉及

- 未触碰任何 JS / CSS 代码逻辑
- 未改地图生成算法、渲染效果、笔刷行为
- `main.js` 保持 100 行（本轮未修改，≤100 红线达标）

### 发现项（本轮未处理，待后续）

- `css/app.css` 为压缩单行格式（1677 字符），可读性差但非本轮范围；后续若展开为多行需确认不影响渲染。
- `main.js` 刚好 100 行踩红线，后续若需改动应先拆到 70~80 行。
- 文档位置分散：`README.md` 随代码在 `qizheng-v0.4.1/`，而 `file-tree.md` / `changelog.md` / `AI_DEVELOPMENT_RULES` 在仓库顶层，历史遗留，本轮未调整。

### 后续计划

文档收口完成，下一步回 qizheng-interplay 执行 v0.6.0-T1-R1 地形数据模块（地形接入移动/视距/战斗）。

---

## V0.0.0.16 | 2026-07-02 21:30:00

**v0.6.0：布局与交互稳定性修复 + 全屏 + 日志倒序。** UI/布局收口，不涉及地貌笔刷或渲染算法调整：

### 修复

1. **地表/地貌模式切换导致地图缩放**
   根因：`.lf` 按钮 `display:none` 从 flex 流中移除元素，面板高度变化触发 `canvasWrap(flex:1)` 重算 `cellSize`。
   修复：`.row` 加 `min-height:33px`，按钮隐藏时行高不塌缩。

2. **地图未铺满屏幕**
   去掉 `.app` 的 `padding:10px`、`max-width:980px`、`margin:0 auto`。gap 8px→4px。Landscape/小屏媒体查询同步清理。body 底色改为地图背景 `#c8d9bd`。

3. **日志消息倒序**
   `push→unshift` / `shift→pop`，最新日志显示在最上方。

### 涉及文件

- `css/app.css` — 全屏布局 + 行高兜底 + 媒体查询清理
- `js/debug.js` — 日志倒序

### 后续计划

qizheng-webUI v0.5.0 地貌编辑器阶段性可用，暂时收口。下一步回到 qizheng-interplay 执行 v0.6.0-T1-R1 地形数据模块。

---

## V0.0.0.15 | 2026-07-02 16:18:15

**v0.5.0-R1: fix deriveTerrain全图污染。** 修复 v0.5.0 中地貌笔刷触发全图 naturalMap 重写导致大面积变棕色的 bug：

- 重写 `deriveTerrain.js`：改为接受 `dirtyRect` 参数，只更新笔刷影响范围（中心±半径+2格边距），不使用 dirtyRect 则不写入
- 移除 `deriveTerrain` 中的 dirt 映射：低地不再自动变成棕色 dirt，一律保持 grass
- 阈值计算仍然基于全图高度分布（保证精度），但 naturalMap 写入限制在 dirtyRect 内
- 修改 `landformBrushes.js`：`_applyLandformPoint` / `_applyLandformLine` 计算 dirtyRect 并传递给 `deriveTerrain`
- 验收：盆地点击后只有局部区域变化，远处底色不再被洗成棕色

## V0.0.0.14 | 2026-07-02 16:03:03

**v0.5.0 地貌笔刷重构版。** 从"地表颜色编辑器"重构为"地貌编辑器"，heightMap 成为地势主数据，naturalMap 改为自动派生：

- 新增 `js/map/landform/` 模块（3 文件）：
  - `landformCore.js` — 通用 stamp 引擎：falloff(linear/smooth/gaussian/plateau)、点到线段距离、圆形/线段 stamp
  - `landformBrushes.js` — 5 种地貌笔刷：山地(gaussian隆起/拖线山脊)、盆地(smooth下凹)、高原(plateau抬升)、山谷(gaussian下切/拖线谷地)、平滑(邻域平均)
  - `deriveTerrain.js` — 根据 heightMap 自动派生 naturalMap（12% 最高→high，其余→grass）
- 修改 `mapBrush.js`：新增地貌笔刷模式，山地/山谷拖线时自动插值线段 stamp
- 修改 `uiState.js` / `uiControls.js`：新增 "地貌/地表" 模式切换 + 5 种地貌按钮（自动显示/隐藏）
- 新增状态字段：`brushMode` / `landformType` / `brushStrength` / `_lx/_ly`
- 旧地形笔刷（草地/高地/水面/树林）保留为地表模式
- 渲染顺序：naturalMap → shadeHigh → drawRelief → contours → waterMap → shore → vegetationMap → overlay

## V0.0.0.13 | 2026-07-02 15:34:10

**v0.4.3-H 随机生成与高度图同步收口。** 审计全部写图入口，将随机生成的河流/水体高度下切到正确范围，建立统一语义写入入口 paintTerrainStamp：

- 新增 `lowerHeightIfHigh()` — 只降低高处(>0.55)，平坦区域不压，解决草地笔误伤坡地
- 新增 `paintTerrainStamp(cx, cy, terrain, half)` — 统一画笔入口：图层写入 + 高度同步
- 新增 `syncWaterHeights()` — 后处理：扫描所有水体，将高度下切到 0.26~0.35
- 修改 `mapBrush.js`：paintAt 改为调用 paintTerrainStamp（统一入口），不再手写循环
- 修改 `mapClear.js`：clearAll 中清除等高线缓存 `_chm/_cht`
- 修改 `mapRandom.js`：generateRandomMap 中河流生成后调用 syncWaterHeights()
- 自检新增 hiLow / wHigh 诊断指标

## V0.0.0.12 | 2026-07-02 11:57:19

**v0.4.3-G 手绘地形与高度图同步。** 让画笔修改地形时同步修改 heightMap，使等高线/坡度阴影/高度底色跟随实际高度变化：

- 新增 `js/map/data/heightEdit.js` — 圆形 falloff 高度编辑工具：raiseHeight / lowerHeight / autoHeight
- 修改 `mapBrush.js`：paintAt 调用 autoHeight()，每次画笔操作后同步高度
- 修改 `mapAccess.js`：移除 paintCell 中水体的随机高度设置，由 stamp 接管
- 修改 `main.js`：自检新增 highCellsWithLowHeight 和 waterCellsWithHighHeight 诊断
- 画笔规则：高地→向 0.78 抬高、草地→向 0.48 回落、水面→向 0.30 下切、树林→不修改 heightMap

## V0.0.0.11 | 2026-07-02 11:49:34

**v0.4.3-F 地势表达重构。** 将"等高线单一表达"拆为"高度底色 + 坡度阴影 + 等高线"三层体系：

- 新增 `js/map/render/drawRelief.js` — 高度底色（低处冷暗/高处暖亮）+ 坡度阴影（基于高度梯度估算坡面）
- 渲染顺序：naturalMap → shadeHigh → drawRelief → contours → waterMap → shore → vegetationMap → overlay
- 高度底色 alpha 0.015~0.10，坡度阴影阈值 0.025，alpha ≤ 0.08
- drawHighEdge() 默认关闭（QZ.showHighEdge = false）
- 日志增加 reliefTint / slopeShade / highEdge 状态
- B~E 轮迭代（0.35→0.015→0.021 阈值演进、box blur 平滑、动态档位、主副线、高地感知）已全部合并到本版

## V0.0.0.10 | 2026-07-02 10:18:42

**v0.4.3-A 等高线辅助层试验版。** 新增可开关等高线渲染层，使用简化 Marching Squares 算法对 heightMap 绘制 3 档等值线：

- 新增 `js/map/render/drawContours.js` — 简化 Marching Squares，每 2×2 格插值绘制等值线短线段
- 渲染顺序：naturalMap → shadeHigh → contours → waterMap → shore → vegetationMap → overlay
- 等高线颜色：低透明淡褐灰 rgba(92,86,58,0.18/0.26/0.32)
- 水体（四角全水）跳过等高线
- UI 增加"等高线"开关按钮，默认关闭
- 移除了 drawOverlay.js 中旧的逐格量化等高线代码

## V0.0.0.9 | 2026-07-01 23:50:00

**自然战场底图版 — 去除人造物，聚焦自然地理。** 从数据结构、渲染、生成器、UI 全面移除人造物层：
- 删除 Surface / Road / Building 枚举和对应图层
- mapRandom.js 移除房屋/道路/线路/印章逻辑（77→34行）
- UI 按钮缩减为 草地/高地/水面/树林
- 地图定位：自然地形 + 植被 + 水文三要素，为班组~团级推演提供比例尺无关底图

## V0.0.0.8 | 2026-07-01 23:30:00

**v0.4.2-A 命名空间硬化修复。** 所有 JS 模块统一使用 `const QZ = window.QZ = window.QZ || {};` 双保险写法。新增 `js/qzNamespace.js` 作为脚本第一入口，新增 `main.js` 启动自检。

## V0.0.0.7 | 2026-07-01 23:00:00

**v0.4.2 分层地图模型重构。** 单层 terrainMap 拆分为 naturalMap / waterMap / vegetationMap / surfaceMap / roadMap / buildingMap 六层，独立存储与渲染。新增 `js/map/data/` 和 `js/map/render/` 目录体系。

## V0.0.0.6 | 2026-07-01 22:25:00

**v0.4.1-A 稳定性修复。** 修复生成顺序、清空残留、边界误涂三个逻辑问题。新增 `js/map/prng.js`（LCG 种子化 PRNG），`QZ.random()` 替代 Math.random()。状态栏显示 Seed。

## V0.0.0.5 | 2026-07-01 22:10:00

**河流平滑与限弯。** 新增 `js/map/water/riverPath.js`：Chaikin 细分 2 次平滑控制点、角度检测防回头弯、圆形印章 + 正弦渐变宽度（河宽 3~5 连续变化）。

## V0.0.0.4 | 2026-07-01 22:05:00

**高地改为按百分比动态生成，面积控制在 8%~18%。** baseTerrain() 改为收集全图高度排序，取最高 8%~18% 作为高地阈值，不再使用固定 .72 阈值。

## V0.0.0.3 | 2026-07-01 21:54:00

**森林从逐格噪点改为斑块式生成。** 新增 `js/map/forest/forestPatch.js`（中心扩散+边缘衰减），decorate() 简化为 25 棵零散点缀。

## V0.0.0.2 | 2026-07-01 21:11:00

Canvas 网格比例修复 + 文档框架建立。地图改为正方形格子居中渲染，横屏不再拉伸。新增 `computeCellLayout()`，修正 `canvasToCell()` 坐标换算。新增 `file-tree.md`、`changelog.md`。

## V0.0.0.1 | 2026-07-01

初始版本 v0.4.1 随机水路重构版基线：随机地图生成（高度图、河流、房屋、道路、装饰）、画笔交互、等高线渲染（隐藏）、响应式 UI、5+100 约束。
