(function(){
const QZ = window.QZ, T = QZ.Terrain, RI = (a,b) => Math.floor(a + Math.random() * (b - a + 1));
QZ.generateForestPatches = function(){
  // 生成 8~18 个树林中心，每中心半径 3~10 格
  const target = RI(8, 18), centers = [];
  for (let i = 0; i < target * 15 && centers.length < target; i++) {
    const x = RI(3, QZ.cols - 4), y = RI(3, QZ.rows - 4);
    if (QZ.getTerrain(x, y) !== T.grass || QZ.nearTerrain(x, y, T.water, 4)) continue;
    if (centers.some(c => Math.hypot(c.x - x, c.y - y) < 10)) continue;
    centers.push({ x, y, r: RI(3, 10) });
  }
  // 从中心扩散，边缘概率衰减
  for (const c of centers) {
    for (let dy = -c.r; dy <= c.r; dy++) for (let dx = -c.r; dx <= c.r; dx++) {
      const dist = Math.hypot(dx, dy);
      if (dist > c.r || Math.random() > 1 - (dist / c.r) * .7) continue;
      const xx = c.x + dx, yy = c.y + dy;
      if (QZ.inBounds(xx, yy) && QZ.getTerrain(xx, yy) === T.grass) QZ.setTerrain(xx, yy, T.forest);
    }
  }
  // 少量零散点缀
  for (let i = 0; i < 20; i++) {
    const x = RI(2, QZ.cols - 3), y = RI(2, QZ.rows - 3);
    if (QZ.getTerrain(x, y) === T.grass) QZ.setTerrain(x, y, T.forest);
  }
};
})();
