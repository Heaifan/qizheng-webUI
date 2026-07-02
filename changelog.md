# 变更日志 — 奇正相生 qizheng-interplay

## V0.0.0.1 | 2026-07-01

初始版本 v0.4.1 随机水路重构版基线：随机地图生成（高度图、河流、房屋、道路、装饰）、画笔交互、等高线渲染（隐藏）、响应式 UI、5+100 约束。

## V0.0.0.2 | 2026-07-01 21:11:00

Canvas 网格比例修复 + 文档框架建立。地图改为正方形格子居中渲染，横屏不再拉伸。新增 `computeCellLayout()`，修正 `canvasToCell()` 坐标换算，等高线/网格/游标适配新坐标。新增 `file-tree.md`、`changelog.md`。

## V0.0.0.3 | 2026-07-01 21:54:00

**森林从逐格噪点改为斑块式生成。** 新增 `js/map/forest/forestPatch.js`（中心扩散+边缘衰减），`baseTerrain()` 不再逐格随机分配树林，`decorate()` 简化为 25 棵零散点缀。

## V0.0.0.4 | 2026-07-01 22:05:00

**高地改为按百分比动态生成，面积控制在 8%~18%。** `baseTerrain()` 改为收集全图高度排序，取最高 8%~18% 作为高地阈值，不再使用固定 `.72` 阈值。

## V0.0.0.5 | 2026-07-01 22:10:00

**河流平滑与限弯。** 新增 `js/map/water/riverPath.js`：Chaikin 细分 2 次平滑控制点、角度检测防回头弯（折角 > 113° 重试）、圆形印章 + 正弦渐变宽度（河宽 3~5 连续变化）。`mapRandom.js` 移除旧的 `makeRiver()` 和 `edgePoint()`。

## V0.0.0.6 | 2026-07-01 22:25:00

**v0.4.1-A 稳定性修复。** 修复三个逻辑问题：
1. 生成顺序：河流先生成后森林，`forestPatch.js` 的 `nearTerrain(water)` 判断不再无效。
2. 清空残留：`clearTerrain()` 新增 `resetHeight` 参数，清空时重置 heightMap；`shadeHigh()` 只对 `high` 地形绘制阴影。
3. 边界误涂：`canvasToCell()` 越界返回 `null`，`move()` 检测 null 时只更新指针不执行 `paintAt()`。
4. 随机可复现：新增 `js/map/prng.js`（LCG 种子化 PRNG），`QZ.random()` 替代所有 `Math.random()`，状态栏显示 Seed，截图时可提供种子值复现地图。
文档同步：README.md 目录约束更新为 "根目录 ≤5 核心文件，子目录扩展"。

## V0.0.0.7 | 2026-07-01 23:00:00

**v0.4.2 分层地图模型重构。** 单层 `terrainMap` 拆分为 6 层明确图层：

| 图层 | 用途 | 类型枚举 |
|---|---|---|
| `naturalMap` | 自然基础地形 | grass / dirt / high |
| `waterMap` | 水体 | river / lake |
| `vegetationMap` | 植被 | forest / bush |
| `surfaceMap` | 人为地表 | concrete / yard |
| `roadMap` | 道路 | path / road / bridge |
| `buildingMap` | 建筑物 | house / warehouse |

新文件结构：
- `js/map/data/` — 常量、初始化、访问器、清空（4 文件）
- `js/map/render/` — 分层渲染管线、叠加层（2 文件）
- 移除 `mapData.js`、`mapContour.js`（功能迁移到 data/ 和 render/）
- 新增水泥地按钮（concrete → surfaceMap）
- 渲染顺序：自然 → 高地阴影 → 水体 → 人为地表 → 道路 → 植被 → 建筑 → 叠加层
- 画笔写入对应图层，生成器写入对应图层，不再互相污染

## V0.0.0.8 | 2026-07-01 23:30:00

**v0.4.2-A 命名空间硬化修复。** 所有 JS 模块统一使用 `const QZ = window.QZ = window.QZ || {};` 双保险写法。新增 `js/qzNamespace.js` 作为脚本第一入口，负责创建 `window.QZ`。新增 `main.js` 启动自检 (`selfCheck()`)，缺失模块时输出中文错误。

## V0.0.0.9 | 2026-07-01 23:50:00

**自然战场底图版 — 去除人造物，聚焦自然地理。** 从数据结构、渲染、生成器、UI 全面移除人造物层：
- 删除 `Surface` / `Road` / `Building` 枚举和对应图层
- `mapRandom.js` 移除房屋/道路/线路/印章逻辑（从 77 行降至 34 行）
- UI 按钮缩减为 草地/高地/水面/树林
- 地图定位：自然地形 + 植被 + 水文三要素，为班组~团级推演提供比例尺无关底图

## V0.0.0.10 | 2026-07-02

**v0.4.3-A 等高线辅助层试验版。** 新增可开关等高线渲染层，使用简化 Marching Squares 算法对 heightMap 绘制 3 档等值线（0.45/0.60/0.75），不改变地图生成逻辑：

- 新增 `js/map/render/drawContours.js` — 简化 Marching Squares，每 2×2 格插值绘制等值线短线段
- 渲染顺序：naturalMap → shadeHigh → **contours** → waterMap → shore → vegetationMap → overlay
- 等高线颜色：低透明淡褐灰（`rgba(92,86,58,0.18)` / `0.26` / `0.32`），不压过自然地形
- 水体格（四角全水）跳过等高线，避免河流上出现杂线
- UI 增加"等高线"开关按钮，默认关闭
- 移除了 `drawOverlay.js` 中旧的等高线代码（逐格量化，非 Marching Squares）
- 调试输出：enabled / levels / segments 计数值

## V0.0.0.11 | 2026-07-02

**v0.4.3-F 地势表达重构。** 将"等高线单一表达"拆为"高度底色 + 坡度阴影 + 等高线"三层体系，让 heightMap 成为地势表达核心：

- 新增 `js/map/render/drawRelief.js` — 高度底色（低处冷暗/高处暖亮）+ 坡度阴影（基于高度梯度估算坡面）
- 渲染顺序：naturalMap → shadeHigh → **drawRelief** → contours → waterMap → shore → vegetationMap → overlay
- 高度底色 alpha 0.015~0.10，坡度阴影阈值 0.025，alpha ≤ 0.08 — 两者极为克制，只提供微妙指示
- `drawHighEdge()` 默认关闭（`QZ.showHighEdge = false`），避免 naturalMap 分类边界被误认为等高线
- 日志增加 reliefTint / slopeShade / highEdge 状态
- B~E 轮迭代持续改进保留：box blur 平滑 / 动态档位 / 主副线 / 高地感知 / 日志节流
- 地貌仍由 waterMap / vegetationMap 自然覆盖
