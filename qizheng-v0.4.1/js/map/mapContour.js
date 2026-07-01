(function(){
const QZ = window.QZ;
QZ.drawContour = function(ctx) {
  if (!QZ.showContour || !QZ.cellSize) return;
  ctx.save(); ctx.globalAlpha = .28; ctx.strokeStyle = '#705f48'; ctx.lineWidth = 1;
  for (let y = 1; y < QZ.rows - 1; y += 2) for (let x = 1; x < QZ.cols - 1; x += 2) {
    const h0 = QZ.heightMap[y][x], level = Math.round(h0 * 10) / 10;
    if (Math.abs(h0 - level) > .015) continue;
    const cx = QZ.offsetX + x * QZ.cellSize, cy = QZ.offsetY + y * QZ.cellSize;
    const half = .45 * QZ.cellSize;
    ctx.beginPath(); ctx.moveTo(cx - half, cy); ctx.lineTo(cx + half, cy); ctx.stroke();
  }
  ctx.restore();
};
})();
