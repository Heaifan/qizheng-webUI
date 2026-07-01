(function(){
const QZ = window.QZ;
const canvas = document.querySelector('#mapCanvas');
const statusBar = document.querySelector('#statusBar');
const loading = document.querySelector('#loading');
const state = QZ.createUiState();
function refreshStatus() {
  const portrait = innerHeight >= innerWidth;
  statusBar.textContent = QZ.statusText(state, portrait);
}
function randomMap() { QZ.setSeed(Date.now()); QZ.generateRandomMap(); state.dirty = true; }
function clearMap() { QZ.clearAll(); state.dirty = true; }
function frame(now) {
  QZ.updateFps(state, now);
  if (QZ.resizeCanvas(canvas)) state.dirty = true;
  if (state.dirty) { QZ.drawMap(canvas, state); refreshStatus(); state.dirty = false; }
  requestAnimationFrame(frame);
}
function boot() {
  QZ.initLayers(); QZ.showContour = false; QZ.setSeed(Date.now());
  QZ.bindControls(state, { random: randomMap, clear: clearMap });
  QZ.bindBrushEvents(canvas, state); randomMap();
  loading.classList.add('hide'); requestAnimationFrame(frame);
}
window.addEventListener('resize', () => { state.dirty = true; });
window.addEventListener('orientationchange', () => { state.dirty = true; });
boot();
})();
