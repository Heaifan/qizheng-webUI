(function(){
const QZ = window.QZ = window.QZ || {}, B = (x, y) => x >= 0 && y >= 0 && x < QZ.cols && y < QZ.rows;
const A = (map, x, y, v) => { if (B(x, y)) { if (v !== undefined) map[y][x] = v; return map[y][x]; } return 0; };
QZ.inBounds = B;
QZ.getNatural   = (x, y) => A(QZ.naturalMap, x, y);
QZ.setNatural   = (x, y, v) => A(QZ.naturalMap, x, y, v);
QZ.getWater     = (x, y) => A(QZ.waterMap, x, y);
QZ.setWater     = (x, y, v) => A(QZ.waterMap, x, y, v);
QZ.getVegetation= (x, y) => A(QZ.vegetationMap, x, y);
QZ.setVegetation= (x, y, v) => A(QZ.vegetationMap, x, y, v);
QZ.getSurface   = (x, y) => A(QZ.surfaceMap, x, y);
QZ.setSurface   = (x, y, v) => A(QZ.surfaceMap, x, y, v);
QZ.getRoad      = (x, y) => A(QZ.roadMap, x, y);
QZ.setRoad      = (x, y, v) => A(QZ.roadMap, x, y, v);
QZ.getBuilding  = (x, y) => A(QZ.buildingMap, x, y);
QZ.setBuilding  = (x, y, v) => A(QZ.buildingMap, x, y, v);
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
})();
