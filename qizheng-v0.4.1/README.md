# 奇正相生 v0.4.1 随机水路重构版

## 使用

直接用浏览器打开 `index.html` 即可运行；也可以用 VS Code Live Server 或任意静态服务器预览。

## 本版重点

- 随机河流：入口、出口、控制点、宽度都会变化。
- 随机道路：先生成房屋/据点，再连接道路。
- 水体收敛：默认不生成碎湖泊，只保留河流。
- 等高线降级：保留 `heightMap` 与 `mapContour.js`，但默认隐藏。
- 画笔保留：拖动自动填充，一个格子只有一种地形。

## 目录

```txt
css/app.css
js/main.js
js/map/mapData.js
js/map/mapBrush.js
js/map/mapDraw.js
js/map/mapRandom.js
js/map/mapContour.js
js/ui/uiState.js
js/ui/uiControls.js
```

## 约束

- `map/` 目录保持 5 个源码文件。
- 所有 JS 文件均控制在 100 行以内。
