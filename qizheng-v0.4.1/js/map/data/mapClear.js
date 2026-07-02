(function(){
const QZ = window.QZ = window.QZ || {}, N = QZ.Natural;
QZ.clearAll = function() {
  for (let y = 0; y < QZ.rows; y++) {
    QZ.naturalMap[y].fill(N.grass);
    QZ.waterMap[y].fill(0);
    QZ.vegetationMap[y].fill(0);
    QZ.heightMap[y].fill(0.45);
  }
  QZ._chm = null; QZ._cht = null;
};
})();
