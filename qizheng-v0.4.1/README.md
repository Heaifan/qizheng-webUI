# 奇正相生 v0.4.2 自然战场底图版

**定位：** 自然战场底图编辑器——只负责地形、植被、水文三类自然要素，为班组~团级推演提供比例尺无关的底图。

## 使用

直接用浏览器打开 `index.html` 即可运行；也可以用 VS Code Live Server 或任意静态服务器预览。

## 当前功能

- **三层地图模型**：自然地形（草地/高地）、水文（河流）、植被（森林），分层独立存储与渲染。
- **随机生成**：随机河流（平滑+限弯+宽度渐变）、森林斑块（中心扩散+边缘衰减）、高地（8%~18% 动态阈值）。
- **画笔工具**：支持 4 种地形绘制（草地/高地/水面/树林），自动写入对应图层。
- **可复现**：内置种子化 PRNG，状态栏显示 Seed 值。
- **比例尺无关**：地图只保存地形关系，格距（1 格 = 1m/5m/20m/50m）由推演场景配置决定。

## 图层结构

| 图层 | 内容 | 渲染顺序 |
|---|---|---|
| `naturalMap` | 草地、高地 | 1 |
| — | 高地阴影（heightMap） | 2 |
| `waterMap` | 河流 | 3 |
| `vegetationMap` | 森林 | 4 |
| overlay | 网格线、游标 | 5 |

## 目录

```txt
css/app.css
js/qzNamespace.js
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

## 未来扩展位

- 道路/桥梁/村庄/工事等人造物层设计已保留，待 v1.x 阶段叠加。
