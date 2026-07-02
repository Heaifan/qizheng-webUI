(function(){
const QZ = window.QZ = window.QZ || {};
const canvas = document.querySelector('#mapCanvas');
const statusBar = document.querySelector('#statusBar');
const loading = document.querySelector('#loading');
const state = QZ.createUiState();
function refreshStatus() {
  const portrait = innerHeight >= innerWidth;
  statusBar.textContent = QZ.statusText(state, portrait);
}
function auditMap() {
  if (!QZ.log) return;
  const total = QZ.cols * QZ.rows;
  let water = 0, fow = 0, huw = 0, isolated = 0, highLow = 0, waterHigh = 0;
  let isoForest = 0, largestForest = 0, highCells = 0, forestCells = 0;
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    const w = QZ.getWater(x, y), n = QZ.getNatural(x, y), v = QZ.getVegetation(x, y);
    if (w) { water++; if (v) fow++; if (n === QZ.Natural.high) huw++; }
    if (n === QZ.Natural.high) { highCells++; if (QZ.getHeight(x, y) < 0.60) highLow++; }
    if (w && QZ.getHeight(x, y) > 0.40) waterHigh++;
    if (v) forestCells++;
    if (v) {
      const noN = !QZ.getVegetation(x - 1, y) && !QZ.getVegetation(x + 1, y) && !QZ.getVegetation(x, y - 1) && !QZ.getVegetation(x, y + 1);
      if (noN) isoForest++;
    }
  }
  const visited = Array.from({ length: QZ.rows }, () => Array(QZ.cols).fill(0));
  const comps = [];
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    if (!QZ.getWater(x, y) || visited[y][x]) continue;
    const comp = { size: 0, touches: new Set(), stack: [[x, y]] };
    visited[y][x] = 1;
    while (comp.stack.length) {
      const [cx, cy] = comp.stack.pop(); comp.size++;
      if (cx === 0) comp.touches.add('L'); if (cx === QZ.cols - 1) comp.touches.add('R');
      if (cy === 0) comp.touches.add('T'); if (cy === QZ.rows - 1) comp.touches.add('B');
      let adj = 0;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (QZ.inBounds(nx, ny) && QZ.getWater(nx, ny)) { adj++; if (!visited[ny][nx]) { visited[ny][nx] = 1; comp.stack.push([nx, ny]); } }
      }
      if (adj === 0 && QZ.inBounds(cx, cy)) isolated++;
    }
    comps.push(comp);
  }
  const fvis = Array.from({ length: QZ.rows }, () => Array(QZ.cols).fill(0));
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    if (!QZ.getVegetation(x, y) || fvis[y][x]) continue;
    let size = 0, stack = [[x, y]]; fvis[y][x] = 1;
    while (stack.length) {
      const [cx, cy] = stack.pop(); size++;
      for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (QZ.inBounds(nx, ny) && QZ.getVegetation(nx, ny) && !fvis[ny][nx]) { fvis[ny][nx] = 1; stack.push([nx, ny]); }
      }
    }
    if (size > largestForest) largestForest = size;
  }
  comps.sort((a, b) => b.size - a.size);
  const largest = comps[0];
  const lr = largest ? largest.size : 0, lb = largest ? [...largest.touches].join('/') : 'none';
  const wr = water || 1;
  const legacyMap = QZ.terrainMap ? '存在' : '不存在';
  const legacyCheck = QZ.Terrain && QZ.Terrain.road ? 'road/house枚举仍存在' : '无旧枚举,跳过扫描';
  const lfr = forestCells ? (largestForest * 100 / forestCells).toFixed(0) : 0;
  QZ.log('═══ 地图自检 ═══');
  QZ.log('旧terrainMap=' + legacyMap + ' | ' + legacyCheck);
  QZ.log('水体: ' + water + '格 最大=' + lr + '(' + (lr * 100 / wr).toFixed(0) + '%) 分量=' + comps.length + ' 触边=' + lb);
  QZ.log('  孤立=' + isolated + ' fow=' + fow + ' huw=' + huw);
  QZ.log('地形: high=' + (highCells * 100 / total).toFixed(0) + '%  forest=' + (forestCells * 100 / total).toFixed(0) + '%  孤立森林=' + isoForest + ' 最大斑块=' + largestForest + '(' + lfr + '%)  hiLow=' + highLow + ' wHigh=' + waterHigh);
}
function randomMap() { QZ.setSeed(Date.now()); QZ.generateRandomMap(); QZ._contourLogNeeded = true; auditMap(); state.dirty = true; }
function clearMap() { QZ.clearAll(); state.dirty = true; }
function frame(now) {
  QZ.updateFps(state, now);
  if (QZ.resizeCanvas(canvas)) state.dirty = true;
  if (state.dirty) { QZ.drawMap(canvas, state); refreshStatus(); state.dirty = false; }
  requestAnimationFrame(frame);
}
function selfCheck() {
  const checks = [
    ['QZ.Natural', QZ.Natural], ['QZ.Water', QZ.Water], ['QZ.Vegetation', QZ.Vegetation],
    ['QZ.initLayers', QZ.initLayers], ['QZ.inBounds', QZ.inBounds], ['QZ.clearAll', QZ.clearAll],
    ['QZ.drawMap', QZ.drawMap], ['QZ.renderLayers', QZ.renderLayers], ['QZ.drawOverlay', QZ.drawOverlay],
  ];
  const missing = checks.filter(([, v]) => !v).map(([n]) => n);
  if (missing.length) console.error('[启动自检失败] 缺少模块: ' + missing.join(', '));
  return !missing.length;
}
function boot() {
  if (!selfCheck()) return;
  QZ.initLayers(); QZ.showContour = false; QZ.showHighEdge = false; QZ.showGrid = true; QZ.setSeed(Date.now());
  QZ.bindControls(state, { random: randomMap, clear: clearMap });
  QZ.bindBrushEvents(canvas, state); randomMap();
  loading.classList.add('hide'); requestAnimationFrame(frame);
}
window.addEventListener('resize', () => { state.dirty = true; });
window.addEventListener('orientationchange', () => { state.dirty = true; });
boot();
})();
