window.QZ = window.QZ || {};

QZ.fuc_initTerrainCanvas = function () {
  var off = document.createElement("canvas");
  off.width = QZ.fuc_mapPixelW();
  off.height = QZ.fuc_mapPixelH();
  QZ.Map.terrainCanvas = off;
  QZ.Map.terrainCtx = off.getContext("2d");
  QZ.fuc_fillTerrainCanvas(QZ.Config.defaultTerrain);
};

QZ.fuc_fillTerrainCanvas = function (terrainId) {
  var terrain = QZ.fuc_getTerrain(terrainId);
  QZ.Map.terrainCtx.fillStyle = terrain.color;
  QZ.Map.terrainCtx.fillRect(0, 0, QZ.fuc_mapPixelW(), QZ.fuc_mapPixelH());
};

QZ.fuc_redrawTerrainCell = function (col, row) {
  var size = QZ.Config.cellSize;
  var terrain = QZ.fuc_getTerrain(QZ.fuc_getCell(col, row));
  QZ.Map.terrainCtx.fillStyle = terrain.color;
  QZ.Map.terrainCtx.fillRect(col * size, row * size, size, size);
};

QZ.fuc_drawScene = function () {
  var ctx = QZ.State.ctx;
  ctx.clearRect(0, 0, QZ.State.viewW, QZ.State.viewH);
  QZ.fuc_drawCanvasBack(ctx);
  QZ.fuc_drawTerrainView(ctx);
  QZ.fuc_drawGrid(ctx);
};

QZ.fuc_drawCanvasBack = function (ctx) {
  ctx.fillStyle = "#0d1520";
  ctx.fillRect(0, 0, QZ.State.viewW, QZ.State.viewH);
};

QZ.fuc_drawTerrainView = function (ctx) {
  var dx = QZ.fuc_viewOffsetX();
  var dy = QZ.fuc_viewOffsetY();
  var sw = Math.min(QZ.State.viewW, QZ.fuc_mapPixelW() - QZ.State.cameraX);
  var sh = Math.min(QZ.State.viewH, QZ.fuc_mapPixelH() - QZ.State.cameraY);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(QZ.Map.terrainCanvas, QZ.State.cameraX, QZ.State.cameraY, sw, sh, dx, dy, sw, sh);
};

QZ.fuc_drawGrid = function (ctx) {
  var step = QZ.Config.cellSize * QZ.Config.gridMajor;
  var startX = QZ.fuc_viewOffsetX() - QZ.State.cameraX % step;
  var startY = QZ.fuc_viewOffsetY() - QZ.State.cameraY % step;
  ctx.strokeStyle = "rgba(255,255,255,0.105)";
  ctx.lineWidth = 1;
  for (var x = startX; x < QZ.State.viewW; x += step) QZ.fuc_drawLine(ctx, x, 0, x, QZ.State.viewH);
  for (var y = startY; y < QZ.State.viewH; y += step) QZ.fuc_drawLine(ctx, 0, y, QZ.State.viewW, y);
};

QZ.fuc_drawLine = function (ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(Math.floor(x1) + 0.5, Math.floor(y1) + 0.5);
  ctx.lineTo(Math.floor(x2) + 0.5, Math.floor(y2) + 0.5);
  ctx.stroke();
};
