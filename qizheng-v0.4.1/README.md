# 奇正相生 v0.4.2 分层地图重构版

## 使用

直接用浏览器打开 `index.html` 即可运行；也可以用 VS Code Live Server 或任意静态服务器预览。

## 本版重点

- **分层地图模型**：单层 `terrainMap` 拆分为 6 层独立图层（自然/水体/植被/地表/道路/建筑）。
- **随机生成**：河流、森林、房屋、道路、水泥地各写入对应图层，不再互相覆盖。
- **画笔保留**：支持 7 种地形绘制，自动写入对应图层。
- **可复现**：内置种子化 PRNG，状态栏显示 Seed 值。
- **高地控制**：面积占比 8%~18%，动态阈值。
- **河流平滑**：Chaikin 细分 + 宽度渐变。

## 图层结构

| 图层 | 内容 | 渲染顺序 |
|---|---|---|
| `naturalMap` | 草地、裸地、高地 | 1 |
| — | 高地阴影（heightMap） | 2 |
| `waterMap` | 河流 | 3 |
| `surfaceMap` | 水泥地 | 4 |
| `roadMap` | 道路 | 5 |
| `vegetationMap` | 森林 | 6 |
| `buildingMap` | 房屋 | 7 |
| overlay | 网格线、游标 | 8 |

## 目录

```txt
css/app.css
js/prng.js
js/main.js
js/map/data/mapConstants.js
js/map/data/mapLayers.js
js/map/data/mapAccess.js
js/map/data/mapClear.js
js/map/render/drawLayers.js
js/map/render/drawOverlay.js
js/map/mapDraw.js
js/map/mapBrush.js
js/map/mapRandom.js
js/map/forest/forestPatch.js
js/map/water/riverPath.js
js/ui/uiState.js
js/ui/uiControls.js
```

## 约束

- `js/map/` 根目录保持 ≤5 个核心装配文件。
- 领域逻辑下沉到子目录（`data/`、`render/`、`forest/`、`water/`）。
- 所有 JS 文件均控制在 100 行以内。
