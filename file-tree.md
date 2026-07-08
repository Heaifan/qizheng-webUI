# 文件树 (file-tree)

奇正相生 MVP v0.3 —— 纯 HTML / 原生 JS / Canvas 地貌编辑器原型（新版本线）

## 根
- index.html —— 页面骨架，14 个 <script> 按序加载，无模块化
- style.css —— 样式，已对齐 index.html（#app / .brand / .canvas-wrap / .toolbar / .section-title / .button-row / .terrain-dot）
- run-local.bat —— 启动本地服务器 (python -m http.server 8080)
- README.md —— 项目说明
- file-tree.md —— 本文件
- changelog.md —— 变更记录
- .gitignore —— 忽略系统/编辑器/日志类文件

## src/ 基础设施 (5)
- config.js —— QZ.Config 全局参数（地图尺寸 / 笔刷范围 / 相机步长）
- state.js —— QZ.State 运行时状态（画布 / 相机 / 模式 / 选中地形）
- canvas.js —— 画布初始化 / 尺寸自适应 / 相机夹紧 / 视口偏移
- loop.js —— requestAnimationFrame 主循环 + FPS + 脏标记重绘
- app.js —— fuc_initApp 编排 8 步初始化链

## map/ 地图 (5)
- terrain.js —— QZ.Terrains 地形表 + fuc_getTerrain
- mapData.js —— Uint8Array 数据 / 读写格 / 地图像素尺寸
- mapHit.js —— 屏幕→世界→格 坐标转换
- mapDraw.js —— 离屏 terrainCanvas 缓存 + drawScene 主画布 + 网格
- mapBrush.js —— 方形笔刷 / Bresenham 连线填充 / 清空

## ui/ 界面 (5)
- uiLayout.js —— fuc_getLayoutName（竖屏 / 平板 / 横屏，唯一布局判断）
- uiButtons.js —— 地形按钮渲染 + 点击选地形
- uiText.js —— 状态栏文本（注意：含重复 getLayoutName，R3 删）
- uiState.js —— 模式按钮 / 地形高亮 / 状态同步
- uiBind.js —— UI 按钮事件绑定 + 模式切换 + 笔刷增减

## input/ 输入 (5)
- pointerState.js —— QZ.Pointer 指针状态
- pointerMap.js —— 主指针判定 / 保存
- pointerBrush.js —— 画笔模式处理（连线填充 + 去重）
- pointerPan.js —— 拖图模式处理（平移相机）
- pointerBind.js —— pointerdown / move / up 事件绑定
