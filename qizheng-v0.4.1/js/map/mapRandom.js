(function(){
const QZ = window.QZ, N = QZ.Natural, V = QZ.Vegetation, B = QZ.Building;
const R = (a, b) => a + QZ.random() * (b - a), RI = (a, b) => Math.floor(R(a, b + 1));
const C = (v, a, b) => Math.max(a, Math.min(b, v)), L = (a, b, t) => a + (b - a) * t;
const T = QZ.Terrain; // 旧版兼容：stamp/line 仍用 type 字符串
QZ.generateRandomMap = function() {
  QZ.clearAll(); buildHeight(); baseTerrain();
  const river = QZ.generateRiver(); QZ.generateForestPatches(); const houses = makeHouses(); connectHouses(houses); decorate();
  return { river, houses };
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
/* 以下为道路与房屋系统 */
function line(a, b, type, width, waterBudget) {
  const dx = b.x - a.x, dy = b.y - a.y, steps = Math.max(Math.abs(dx), Math.abs(dy)) * 2 + 1; let budget = waterBudget;
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(L(a.x, b.x, i / steps)), y = Math.round(L(a.y, b.y, i / steps));
    budget = stamp(x, y, width, type, budget);
  }
  return budget;
}
function stamp(cx, cy, w, type, budget) {
  const info = QZ.LayerInfo[type]; if (!info) return budget;
  const setter = { natural: QZ.setNatural, water: QZ.setWater, vegetation: QZ.setVegetation, surface: QZ.setSurface, road: QZ.setRoad, building: QZ.setBuilding }[info.layer];
  if (!setter) return budget;
  const r = Math.max(0, Math.floor(w / 2));
  for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
    if (!QZ.inBounds(x, y) || Math.hypot(x - cx, y - cy) > r + .45) continue;
    if (type === T.road && QZ.isWater(x, y)) { if (budget-- <= 0) continue; }
    setter(x, y, info.value);
  }
  return budget;
}
function farFrom(list, x, y, minD) { return list.every(p => Math.hypot(p.x - x, p.y - y) >= minD); }
function makeHouses() {
  const want = RI(4, 7), list = [];
  for (let tries = 0; tries < 700 && list.length < want; tries++) {
    const x = RI(5, QZ.cols - 6), y = RI(5, QZ.rows - 6);
    if (QZ.nearLayer(QZ.waterMap, x, y, 5) || !farFrom(list, x, y, 9)) continue;
    list.push({ x, y }); stamp(x, y, 2, T.house, 0);
  }
  return list;
}
function connectHouses(houses) {
  houses.sort((a, b) => a.y - b.y || a.x - b.x);
  for (let i = 0; i < houses.length - 1; i++) roadBetween(houses[i], houses[i + 1]);
  if (houses.length > 4) roadBetween(houses[0], houses[RI(2, houses.length - 1)]);
}
function roadBetween(a, b) {
  const mid = { x: Math.round((a.x + b.x) / 2 + R(-8, 8)), y: Math.round((a.y + b.y) / 2 + R(-10, 10)) };
  const p = { x: C(mid.x, 2, QZ.cols - 3), y: C(mid.y, 2, QZ.rows - 3) };
  let budget = 10; budget = line(a, p, T.road, 1, budget); line(p, b, T.road, 1, budget);
  stamp(a.x, a.y, 2, T.house, 0); stamp(b.x, b.y, 2, T.house, 0);
}
function decorate() {
  for (let i = 0; i < 25; i++) {
    const x = RI(2, QZ.cols - 3), y = RI(2, QZ.rows - 3);
    if (QZ.getNatural(x, y) === N.grass && !QZ.getVegetation(x, y) && !QZ.isWater(x, y)) QZ.setVegetation(x, y, V.forest);
  }
}
})();
