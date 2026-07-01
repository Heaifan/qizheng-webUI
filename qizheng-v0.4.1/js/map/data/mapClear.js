(function(){
const QZ = window.QZ = window.QZ || {}, N = QZ.Natural;
QZ.clearAll = function() {
  const cols = QZ.cols, rows = QZ.rows;
  for (let y = 0; y < rows; y++) {
    QZ.naturalMap[y].fill(N.grass);
    QZ.waterMap[y].fill(0);
    QZ.vegetationMap[y].fill(0);
    QZ.surfaceMap[y].fill(0);
    QZ.roadMap[y].fill(0);
    QZ.buildingMap[y].fill(0);
    QZ.heightMap[y].fill(0.45);
  }
};
})();
