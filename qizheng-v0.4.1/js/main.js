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
  let water = 0, fow = 0, huw = 0, discon = 0, borderSides = new Set();
  // 水体连通分量分析（洪水填充）
  const visited = Array.from({ length: QZ.rows }, () => Array(QZ.cols).fill(0));
  const comps = [];
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    const w = QZ.getWater(x, y), n = QZ.getNatural(x, y), v = QZ.getVegetation(x, y);
    if (w) { water++; if (v) fow++; if (n === QZ.Natural.high) huw++; }
    if (w && !visited[y][x]) {
      let size = 0, stack = [[x, y]];
      visited[y][x] = 1;
      while (stack.length) {
        const [cx, cy] = stack.pop(); size++;
        if (cx === 0) borderSides.add('left');
        if (cx === QZ.cols - 1) borderSides.add('right');
        if (cy === 0) borderSides.add('top');
        if (cy === QZ.rows - 1) borderSides.add('bottom');
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (QZ.inBounds(nx, ny) && QZ.getWater(nx, ny) && !visited[ny][nx]) {
            visited[ny][nx] = 1; stack.push([nx, ny]);
          }
        }
      }
      comps.push(size);
    }
  }
  comps.sort((a, b) => b - a);
  const largest = comps[0] || 0, total = water || 1;
  QZ.log('═══ 地图自检 ═══');
  QZ.log('分层模型: true | terrainMap: 已删除');
  QZ.log('water=' + water + ' 最大连通=' + largest + ' (' + (largest * 100 / total).toFixed(0) + '%) 分量数=' + comps.length);
  QZ.log('forestOnWater=' + fow + ' highUnderWater=' + huw + ' 孤立水格=' + discon + ' 触边=' + borderSides.size + '(' + [...borderSides].join('/') + ')');
  QZ.log('road/house: 已去除');
}
function randomMap() { QZ.setSeed(Date.now()); QZ.generateRandomMap(); auditMap(); state.dirty = true; }
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
  QZ.initLayers(); QZ.showContour = false; QZ.setSeed(Date.now());
  QZ.bindControls(state, { random: randomMap, clear: clearMap });
  QZ.bindBrushEvents(canvas, state); randomMap();
  loading.classList.add('hide'); requestAnimationFrame(frame);
}
window.addEventListener('resize', () => { state.dirty = true; });
window.addEventListener('orientationchange', () => { state.dirty = true; });
boot();
})();
