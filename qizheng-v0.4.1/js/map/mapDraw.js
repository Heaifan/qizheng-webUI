(function(){
const QZ = window.QZ, T = QZ.Terrain;
const Color = { [T.grass]: '#9fbe77', [T.road]: '#c7aa70', [T.forest]: '#587d4e', [T.water]: '#4c95bd', [T.house]: '#b76d4d', [T.high]: '#b8a067' };
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
function fillCell(ctx, x, y, type) {
  ctx.fillStyle = Color[type] || Color[T.grass];
  ctx.fillRect(QZ.offsetX + x * QZ.cellSize, QZ.offsetY + y * QZ.cellSize, QZ.cellSize + 1, QZ.cellSize + 1);
}
function shadeHigh(ctx, x, y) {
  const h = QZ.getHeight(x, y); if (h < .55) return;
  ctx.globalAlpha = Math.min(.18, (h - .55) * .45);
  ctx.fillStyle = '#fff2b2';
  ctx.fillRect(QZ.offsetX + x * QZ.cellSize, QZ.offsetY + y * QZ.cellSize, QZ.cellSize + 1, QZ.cellSize + 1);
  ctx.globalAlpha = 1;
}
function drawGrid(ctx) {
  if (QZ.cellSize < 6) return;
  const maxX = QZ.offsetX + QZ.cols * QZ.cellSize, maxY = QZ.offsetY + QZ.rows * QZ.cellSize;
  ctx.save(); ctx.strokeStyle = 'rgba(60,45,30,.11)'; ctx.lineWidth = 1;
  for (let x = 0; x <= QZ.cols; x += 4) {
    const px = QZ.offsetX + x * QZ.cellSize;
    ctx.beginPath(); ctx.moveTo(px, QZ.offsetY); ctx.lineTo(px, maxY); ctx.stroke();
  }
  for (let y = 0; y <= QZ.rows; y += 4) {
    const py = QZ.offsetY + y * QZ.cellSize;
    ctx.beginPath(); ctx.moveTo(QZ.offsetX, py); ctx.lineTo(maxX, py); ctx.stroke();
  }
  ctx.restore();
}
function drawCursor(ctx, state) {
  if (state.cellX < 0) return;
  const r = Math.floor(state.brushSize / 2);
  ctx.save(); ctx.strokeStyle = '#1e2730'; ctx.lineWidth = 2;
  ctx.strokeRect(
    QZ.offsetX + (state.cellX - r) * QZ.cellSize,
    QZ.offsetY + (state.cellY - r) * QZ.cellSize,
    (r * 2 + 1) * QZ.cellSize, (r * 2 + 1) * QZ.cellSize
  ); ctx.restore();
}
QZ.drawMap = function(canvas, state) {
  QZ.resizeCanvas(canvas); QZ.computeCellLayout(canvas);
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  QZ.eachCell((x, y, type) => { fillCell(ctx, x, y, type); shadeHigh(ctx, x, y); });
  drawGrid(ctx); QZ.drawContour(ctx); drawCursor(ctx, state);
};
})();
