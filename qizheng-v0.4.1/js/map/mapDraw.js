(function(){
const QZ = window.QZ = window.QZ || {};
QZ.resizeCanvas = function(canvas) {
  const dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
  const w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; return true; }
  return false;
};
QZ.computeCellLayout = function(canvas) {
  const dpr = Math.max(1, Math.min(2, devicePixelRatio || 1));
  const cs = Math.floor(Math.min(canvas.width / QZ.cols, canvas.height / QZ.rows));
  QZ.cellSize = Math.max(1, cs);
  QZ.offsetX = Math.floor((canvas.width - QZ.cols * QZ.cellSize) / 2);
  QZ.offsetY = Math.floor((canvas.height - QZ.rows * QZ.cellSize) / 2);
  QZ._dpr = dpr;
};
QZ.drawMap = function(canvas, state) {
  QZ.resizeCanvas(canvas); QZ.computeCellLayout(canvas);
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  QZ.renderLayers(ctx);
  QZ.drawOverlay(ctx, state);
};
})();
