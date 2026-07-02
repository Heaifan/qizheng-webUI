(function(){
const QZ = window.QZ = window.QZ || {};
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
