(function(){
const QZ = window.QZ = window.QZ || {};
QZ.initLayers = function(cols = 72, rows = 128) {
  QZ.cols = cols; QZ.rows = rows;
  const make = () => Array.from({ length: rows }, () => Array(cols).fill(0));
  QZ.naturalMap   = make();
  QZ.waterMap      = make();
  QZ.vegetationMap = make();
  QZ.surfaceMap    = make();
  QZ.roadMap       = make();
  QZ.buildingMap   = make();
  QZ.heightMap     = Array.from({ length: rows }, () => Array(cols).fill(0.45));
  // 默认全图草地
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) QZ.naturalMap[y][x] = QZ.Natural.grass;
  return QZ;
};
})();
