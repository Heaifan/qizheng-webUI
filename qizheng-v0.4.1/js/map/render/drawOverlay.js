(function(){
const QZ = window.QZ = window.QZ || {};
QZ.drawOverlay = function(ctx, state) {
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
