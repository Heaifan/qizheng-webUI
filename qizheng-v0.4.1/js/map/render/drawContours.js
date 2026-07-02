(function(){
const QZ = window.QZ = window.QZ || {};
// 简化 Marching Squares — 对 heightMap 绘制 3 档等值线
function drawLevel(ctx, level, color, oX, oY, cs) {
  let seg = 0;
  ctx.strokeStyle = color;
  const H = QZ.heightMap, rows = QZ.rows, cols = QZ.cols;
  for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) {
    // 2×2 四角任意一个是水即跳过，河岸更干净
    if (QZ.getWater(x,y) || QZ.getWater(x+1,y) || QZ.getWater(x,y+1) || QZ.getWater(x+1,y+1)) continue;
    const tl = H[y][x] >= level, tr = H[y][x+1] >= level;
    const bl = H[y+1][x] >= level, br = H[y+1][x+1] >= level;
    const code = (tl << 3) | (tr << 2) | (bl << 1) | br;
    if (!code || code === 15) continue;
    const pts = [];
    for (const [x1,y1,x2,y2] of [[x,y,x+1,y],[x+1,y,x+1,y+1],[x,y+1,x+1,y+1],[x,y,x,y+1]]) {
      const h1 = H[y1][x1], h2 = H[y2][x2];
      if ((h1 < level) !== (h2 < level)) {
        const t = (level - h1) / (h2 - h1);
        pts.push({x: (x1 + (x2-x1)*t) * cs + oX, y: (y1 + (y2-y1)*t) * cs + oY});
      }
    }
    if (pts.length < 2) continue;
    seg++;
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[1].x, pts[1].y); ctx.stroke();
    if (pts.length === 4) {
      ctx.beginPath(); ctx.moveTo(pts[2].x, pts[2].y); ctx.lineTo(pts[3].x, pts[3].y); ctx.stroke();
    }
  }
  return seg;
}
QZ.drawContours = function(ctx) {
  if (!QZ.showContour || !QZ.cellSize) return;
  ctx.save(); ctx.lineWidth = 0.8;
  const oX = QZ.offsetX, oY = QZ.offsetY, cs = QZ.cellSize;
  let total = 0;
  total += drawLevel(ctx, 0.55, 'rgba(92,86,58,0.18)', oX, oY, cs);
  total += drawLevel(ctx, 0.68, 'rgba(80,72,48,0.26)', oX, oY, cs);
  total += drawLevel(ctx, 0.80, 'rgba(70,60,40,0.32)', oX, oY, cs);
  ctx.restore();
  // 日志节流：只在 _contourLogNeeded 标志为 true 时输出一次
  if (QZ._contourLogNeeded) {
    const dense = total > 1800 ? ' | 偏密(>1800)' : '';
    QZ.log('等高线: enabled=' + QZ.showContour + ' levels=[0.55,0.68,0.80] segments=' + total + dense);
    QZ._contourLogNeeded = false;
  }
};
})();
