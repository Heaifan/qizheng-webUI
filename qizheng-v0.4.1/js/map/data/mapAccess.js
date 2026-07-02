(function(){
const QZ = window.QZ = window.QZ || {};
const B = (x, y) => x >= 0 && y >= 0 && x < QZ.cols && y < QZ.rows;
const A = (map, x, y, v) => { if (B(x, y)) { if (v !== undefined) map[y][x] = v; return map[y][x]; } return 0; };
QZ.inBounds = B;
QZ.getNatural   = (x, y) => A(QZ.naturalMap, x, y);
QZ.setNatural   = (x, y, v) => A(QZ.naturalMap, x, y, v);
QZ.getWater     = (x, y) => A(QZ.waterMap, x, y);
QZ.setWater     = (x, y, v) => A(QZ.waterMap, x, y, v);
QZ.getVegetation= (x, y) => A(QZ.vegetationMap, x, y);
QZ.setVegetation= (x, y, v) => A(QZ.vegetationMap, x, y, v);
QZ.getHeight    = (x, y) => B(x, y) ? QZ.heightMap[y][x] : 0;
QZ.setHeight    = (x, y, h) => { if (B(x, y)) QZ.heightMap[y][x] = Math.max(0, Math.min(1, h)); };
QZ.isWater      = (x, y) => QZ.getWater(x, y) > 0;
QZ.nearLayer    = (map, x, y, r) => {
  for (let yy = y - r; yy <= y + r; yy++) for (let xx = x - r; xx <= x + r; xx++)
    if (B(xx, yy) && map[yy][xx] > 0) return true;
  return false;
};
QZ.eachCell = function(fn, map) {
  const d = map || QZ.naturalMap;
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) fn(x, y, d[y][x]);
};
// 统一地图写入入口 — 所有画笔/生成/填充必须走此函数
QZ.paintCell = function(x, y, terrain) {
  if (!QZ.inBounds(x, y)) return;
  const info = QZ.LayerInfo[terrain];
  if (!info) return;
  if (info.layer === 'natural') {
    QZ.setNatural(x, y, info.value);
    QZ.setWater(x, y, 0);
    QZ.setVegetation(x, y, 0);
  } else if (info.layer === 'water') {
    QZ.setWater(x, y, info.value);
    QZ.setVegetation(x, y, 0);
    if (QZ.getNatural(x, y) === QZ.Natural.high) QZ.setNatural(x, y, QZ.Natural.grass);
  } else if (info.layer === 'vegetation') {
    if (QZ.getWater(x, y) > 0) return; // 水面上禁止种树
    QZ.setVegetation(x, y, info.value);
  }
};
})();
