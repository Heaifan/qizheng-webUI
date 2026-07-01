(function(){
const QZ = window.QZ = window.QZ || {}, N = QZ.Natural;
QZ.initLayers = function(cols = 72, rows = 128) {
  QZ.cols = cols; QZ.rows = rows;
  const make = () => Array.from({ length: rows }, () => Array(cols).fill(0));
  QZ.naturalMap   = make();
  QZ.waterMap      = make();
  QZ.vegetationMap = make();
  QZ.heightMap     = Array.from({ length: rows }, () => Array(cols).fill(0.45));
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) QZ.naturalMap[y][x] = N.grass;
  return QZ;
};
})();
