(function(){
const QZ = window.QZ;
QZ.drawOverlay = function(ctx, state) {
  // 网格线
  if (QZ.cellSize >= 6) {
    const oX = QZ.offsetX, oY = QZ.offsetY, cs = QZ.cellSize;
    const mx = oX + QZ.cols * cs, my = oY + QZ.rows * cs;
    ctx.save(); ctx.strokeStyle = 'rgba(60,45,30,.11)'; ctx.lineWidth = 1;
    for (let x = 0; x <= QZ.cols; x += 4) { const px = oX + x * cs; ctx.beginPath(); ctx.moveTo(px, oY); ctx.lineTo(px, my); ctx.stroke(); }
    for (let y = 0; y <= QZ.rows; y += 4) { const py = oY + y * cs; ctx.beginPath(); ctx.moveTo(oX, py); ctx.lineTo(mx, py); ctx.stroke(); }
    ctx.restore();
  }
  // 等高线（默认隐藏）
  if (QZ.showContour && QZ.cellSize) {
    ctx.save(); ctx.globalAlpha = .28; ctx.strokeStyle = '#705f48'; ctx.lineWidth = 1;
    for (let y = 1; y < QZ.rows - 1; y += 2) for (let x = 1; x < QZ.cols - 1; x += 2) {
      const h0 = QZ.heightMap[y][x], level = Math.round(h0 * 10) / 10;
      if (Math.abs(h0 - level) > .015) continue;
      const cx = QZ.offsetX + x * QZ.cellSize, half = .45 * QZ.cellSize;
      ctx.beginPath(); ctx.moveTo(cx - half, QZ.offsetY + y * QZ.cellSize); ctx.lineTo(cx + half, QZ.offsetY + y * QZ.cellSize); ctx.stroke();
    }
    ctx.restore();
  }
  // 游标
  if (state.cellX >= 0) {
    const r = Math.floor(state.brushSize / 2);
    ctx.save(); ctx.strokeStyle = '#1e2730'; ctx.lineWidth = 2;
    ctx.strokeRect(
      QZ.offsetX + (state.cellX - r) * QZ.cellSize, QZ.offsetY + (state.cellY - r) * QZ.cellSize,
      (r * 2 + 1) * QZ.cellSize, (r * 2 + 1) * QZ.cellSize
    ); ctx.restore();
  }
};
})();
