(function(){
const QZ = window.QZ = window.QZ || {}, N = QZ.Natural, V = QZ.Vegetation;
const R = (a, b) => a + QZ.random() * (b - a), RI = (a, b) => Math.floor(R(a, b + 1));
const C = (v, a, b) => Math.max(a, Math.min(b, v));
QZ.generateRandomMap = function() {
  QZ.clearAll(); buildHeight(); baseTerrain();
  const river = QZ.generateRiver(); QZ.generateForestPatches(); decorate();
  return { river };
};
function buildHeight() {
  const ax = R(.02, .06), ay = R(.02, .06), px = R(0, 9), py = R(0, 9), slope = R(-.25, .25);
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    const nx = x / QZ.cols, wave = Math.sin((x + px) * ax) + Math.cos((y + py) * ay);
    const ridge = Math.sin((x * .07 + y * .035) + px) * .08;
    QZ.setHeight(x, y, C(.48 + wave * .13 + ridge + (nx - .5) * slope + QZ.random() * .08, 0, 1));
  }
}
function baseTerrain() {
  const all = [];
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) all.push(QZ.heightMap[y][x]);
  all.sort((a, b) => b - a);
  const target = Math.floor(all.length * (0.08 + QZ.random() * 0.10));
  const threshold = all[Math.min(target, all.length - 1)];
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    QZ.setNatural(x, y, QZ.heightMap[y][x] >= threshold ? N.high : N.grass);
  }
}
function decorate() {
  for (let i = 0; i < 8; i++) {
    const x = RI(2, QZ.cols - 3), y = RI(2, QZ.rows - 3);
    if (QZ.getNatural(x, y) === N.grass && !QZ.getVegetation(x, y) && !QZ.isWater(x, y)) QZ.setVegetation(x, y, V.forest);
  }
}
})();
