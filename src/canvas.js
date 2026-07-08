window.QZ = window.QZ || {};

QZ.fuc_initCanvas = function () {
  var canvas = document.getElementById("gameCanvas");
  QZ.State.canvas = canvas;
  QZ.State.ctx = canvas.getContext("2d");
  QZ.fuc_resizeCanvas();
  window.addEventListener("resize", QZ.fuc_resizeCanvas);
};

QZ.fuc_resizeCanvas = function () {
  var rect = QZ.State.canvas.getBoundingClientRect();
  QZ.State.dpr = Math.max(1, window.devicePixelRatio || 1);
  QZ.State.viewW = Math.max(1, Math.floor(rect.width));
  QZ.State.viewH = Math.max(1, Math.floor(rect.height));
  QZ.State.canvas.width = Math.floor(QZ.State.viewW * QZ.State.dpr);
  QZ.State.canvas.height = Math.floor(QZ.State.viewH * QZ.State.dpr);
  QZ.State.ctx.setTransform(QZ.State.dpr, 0, 0, QZ.State.dpr, 0, 0);
  QZ.fuc_clampCamera();
  QZ.State.needsDraw = true;
};

QZ.fuc_clampCamera = function () {
  var maxX = QZ.fuc_mapPixelW() - QZ.State.viewW;
  var maxY = QZ.fuc_mapPixelH() - QZ.State.viewH;
  QZ.State.cameraX = Math.max(0, Math.min(QZ.State.cameraX, Math.max(0, maxX)));
  QZ.State.cameraY = Math.max(0, Math.min(QZ.State.cameraY, Math.max(0, maxY)));
};

QZ.fuc_viewOffsetX = function () {
  return Math.max(0, Math.floor((QZ.State.viewW - QZ.fuc_mapPixelW()) / 2));
};

QZ.fuc_viewOffsetY = function () {
  return Math.max(0, Math.floor((QZ.State.viewH - QZ.fuc_mapPixelH()) / 2));
};
