(function(){
const QZ = window.QZ = window.QZ || {};
// 简化 Marching Squares — 动态 7 档等高线 + 主副线层级
function drawLevel(ctx, level, color, lw, oX, oY, cs) {
  let seg = 0; ctx.strokeStyle = color; ctx.lineWidth = lw;
  const H = QZ.heightMap, rows = QZ.rows, cols = QZ.cols;
  for (let y = 0; y < rows - 1; y++) for (let x = 0; x < cols - 1; x++) {
    if (QZ.getWater(x,y) && QZ.getWater(x+1,y) && QZ.getWater(x,y+1) && QZ.getWater(x+1,y+1)) continue;
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
    seg++; ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y); ctx.lineTo(pts[1].x, pts[1].y); ctx.stroke();
    if (pts.length === 4) { ctx.beginPath(); ctx.moveTo(pts[2].x, pts[2].y); ctx.lineTo(pts[3].x, pts[3].y); ctx.stroke(); }
  }
  return seg;
}
QZ.drawContours = function(ctx) {
  if (!QZ.showContour || !QZ.cellSize) return;
  ctx.save(); const oX = QZ.offsetX, oY = QZ.offsetY, cs = QZ.cellSize;
  // 动态等级：扫描 heightMap，去掉 8% 极值边距后在有效范围生成 7 档
  const H = QZ.heightMap; let minH = 1, maxH = 0;
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    const h = H[y][x]; if (h < minH) minH = h; if (h > maxH) maxH = h;
  }
  const range = Math.max(maxH - minH, 0.06), margin = range * 0.08;
  const lo = +(minH + margin).toFixed(3), hi = +(maxH - margin).toFixed(3);
  // 每 3 条选一条为主线（i%3===0: i=0,3,6 为主线，其余为副线）
  const lvls = Array.from({length:7}, (_,i) => +(lo + (hi - lo) * i / 6).toFixed(3));
  let total = 0;
  for (let i = 0; i < 7; i++) {
    const major = i % 3 === 0;
    total += drawLevel(ctx, lvls[i], 'rgba(80,72,48,' + (major ? 0.33 : 0.18) + ')', major ? 1.0 : 0.5, oX, oY, cs);
  }
  ctx.restore();
  if (QZ._contourLogNeeded) {
    QZ.log('等高线: enabled=' + QZ.showContour + ' mode=dynamic minH=' + minH.toFixed(3) + ' maxH=' + maxH.toFixed(3) +
      ' levels=[' + lvls.join(',') + '] major=[' + lvls.filter((_,i)=>i%3===0).join(',') + '] segments=' + total);
    QZ._contourLogNeeded = false;
  }
};
})();
