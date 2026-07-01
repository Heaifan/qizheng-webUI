# 项目文件树 — 奇正相生 qizheng-interplay v0.4.1

```
qizheng-v0.4.1/
├── index.html              — 应用入口，定义 UI 结构和脚本加载顺序
├── css/
│   └── app.css             — 主样式，响应式布局，桌面/横屏/手机适配
├── js/
│   ├── prng.js             — 可种子化伪随机数生成器 (LCG)，地图可复现
│   ├── main.js             — 启动器 + 主循环 (frame loop)，初始化、绑定控件
│   ├── map/
│   │   ├── forest/
│   │   │   └── forestPatch.js — 森林斑块生成器：中心扩散+边缘衰减，非逐格随机
│   │   ├── water/
│   │   │   └── riverPath.js   — 河流平滑生成器：Chaikin 细分+角度检测+宽度渐变
│   │   ├── mapData.js      — 数据层：地形常量、网格创建、terrainMap/heightMap 读写
│   │   ├── mapBrush.js     — 画笔交互：pointer 坐标转格子、拖动填充、事件绑定
│   │   ├── mapContour.js   — 等高线渲染（默认隐藏），基于 heightMap 绘制轮廓
│   │   ├── mapDraw.js      — 渲染层：画布缩放、格子绘制、网格/游标、主渲染循环
│   │   └── mapRandom.js    — 随机地图生成器：高度图、河流、房屋、道路、装饰
│   └── ui/
│       ├── uiControls.js   — UI 按钮事件绑定：地形选择、模式切换、笔刷、清空、随机
│       └── uiState.js      — 状态管理：模式、地形、笔刷、FPS、种子值、状态栏文本
├── README.md               — 项目说明文档
├── file-tree.md            — 本文件，项目文件树与功能说明
└── changelog.md            — 变更日志
```

**说明：** 所有 JS 文件均为 IIFE + `window.QZ` 命名空间的纯前端脚本，无框架依赖，通过 `<script>` 标签按序加载。

### 约束

- `js/map/` 根目录保持 ≤5 个核心装配文件（当前 5 个）。
- 领域逻辑下沉到子目录（如 `forest/`、`water/`）。
- 跨模块基础设施文件位于 `js/` 根目录（如 `prng.js`）。
- 所有 JS 文件 ≤ 100 行。
- 新增/移动文件须同步更新 `file-tree.md` 和 `changelog.md`。
