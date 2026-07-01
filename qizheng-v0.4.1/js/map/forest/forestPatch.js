(function(){
const QZ = window.QZ = window.QZ || {}, N = QZ.Natural, V = QZ.Vegetation, RI = (a,b) => QZ.randomInt(a, b);
QZ.generateForestPatches = function(){
  const target = RI(8, 18), centers = [];
  for (let i = 0; i < target * 15 && centers.length < target; i++) {
    const x = RI(3, QZ.cols - 4), y = RI(3, QZ.rows - 4);
    if (QZ.getNatural(x, y) !== N.grass || QZ.nearLayer(QZ.waterMap, x, y, 4)) continue;
    if (centers.some(c => Math.hypot(c.x - x, c.y - y) < 10)) continue;
    centers.push({ x, y, r: RI(3, 10) });
  }
  for (const c of centers) {
    for (let dy = -c.r; dy <= c.r; dy++) for (let dx = -c.r; dx <= c.r; dx++) {
      const dist = Math.hypot(dx, dy);
      if (dist > c.r || QZ.random() > 1 - (dist / c.r) * .7) continue;
      const xx = c.x + dx, yy = c.y + dy;
      if (QZ.inBounds(xx, yy) && QZ.getNatural(xx, yy) === N.grass && !QZ.isWater(xx, yy)) QZ.setVegetation(xx, yy, V.forest);
    }
  }
  for (let i = 0; i < 20; i++) {
    const x = RI(2, QZ.cols - 3), y = RI(2, QZ.rows - 3);
    if (QZ.getNatural(x, y) === N.grass && !QZ.getVegetation(x, y) && !QZ.isWater(x, y)) QZ.setVegetation(x, y, V.forest);
  }
};
})();
