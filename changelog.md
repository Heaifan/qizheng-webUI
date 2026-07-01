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
文档同步：README.md 目录约束更新为 "根目录 ≤5 核心文件，子目录扩展"。`mapRandom.js` 降至 75 行。
