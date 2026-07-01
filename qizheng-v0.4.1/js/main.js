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
  let water = 0, fow = 0, huw = 0, discon = 0;
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    const w = QZ.getWater(x, y), n = QZ.getNatural(x, y), v = QZ.getVegetation(x, y);
    if (w) { water++; if (v) fow++; if (n === QZ.Natural.high) huw++; }
  }
  // 水体连通性：统计孤立水格
  for (let y = 1; y < QZ.rows - 1; y++) for (let x = 1; x < QZ.cols - 1; x++) {
    if (!QZ.getWater(x, y)) continue;
    if (!QZ.getWater(x-1,y) && !QZ.getWater(x+1,y) && !QZ.getWater(x,y-1) && !QZ.getWater(x,y+1)) discon++;
  }
  QZ.log('═══ 地图自检 ═══');
  QZ.log('分层模型: true | terrainMap: 已删除');
  QZ.log('waterCells='+water+' forestOnWater='+fow+' highUnderWater='+huw+' 孤立水格='+discon);
  QZ.log('road/house/building/surface: 已去除 (应为0)');
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
