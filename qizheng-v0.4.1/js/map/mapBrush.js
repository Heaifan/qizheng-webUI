(function(){
const QZ = window.QZ = window.QZ || {};
function clientPos(ev) {
  if (ev.touches && ev.touches[0]) return { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  return { x: ev.clientX, y: ev.clientY };
}
QZ.canvasToCell = function(canvas, ev) {
  const p = clientPos(ev), r = canvas.getBoundingClientRect();
  // 若 computeCellLayout 尚未运行，临时计算
  if (!QZ.cellSize) QZ.computeCellLayout(canvas);
  const dpr = QZ._dpr || Math.max(1, Math.min(2, devicePixelRatio || 1));
  const px = (p.x - r.left) * dpr, py = (p.y - r.top) * dpr;
  const x = Math.floor((px - QZ.offsetX) / QZ.cellSize);
  const y = Math.floor((py - QZ.offsetY) / QZ.cellSize);
  if (x < 0 || y < 0 || x >= QZ.cols || y >= QZ.rows) return null;
  return { x, y };
};
QZ.paintAt = function(cx, cy, state) {
  const info = QZ.LayerInfo[state.terrain];
  QZ.log('画笔@('+cx+','+cy+') terrain='+state.terrain+' layer='+(info?info.layer:'?')+' val='+(info?info.value:'?'));
  if (!info) return;
  const setter = { natural: QZ.setNatural, water: QZ.setWater, vegetation: QZ.setVegetation }[info.layer];
  if (!setter) { QZ.log('  ✗ 无setter: '+info.layer); return; }
  const half = Math.floor(state.brushSize / 2);
  for (let y = cy - half; y <= cy + half; y++) for (let x = cx - half; x <= cx + half; x++) {
    if (Math.abs(x - cx) + Math.abs(y - cy) <= half + 1 && QZ.inBounds(x, y)) setter(x, y, info.value);
  }
  const readback = QZ.inBounds(cx, cy) ? ' natural='+QZ.getNatural(cx,cy)+' water='+QZ.getWater(cx,cy)+' veg='+QZ.getVegetation(cx,cy) : '';
  QZ.log('  ✓ 写入完成'+readback);
  state.dirty = true;
};
QZ.bindBrushEvents = function(canvas, state) {
  let down = false;
  const move = ev => {
    ev.preventDefault(); const cell = QZ.canvasToCell(canvas, ev);
    if (!cell) { QZ.setPointerCell(state, -1, -1); return; }
    QZ.setPointerCell(state, cell.x, cell.y);
    if (down && state.mode === 'brush') QZ.paintAt(cell.x, cell.y, state);
  };
  canvas.addEventListener('pointerdown', ev => { down = true; canvas.setPointerCapture?.(ev.pointerId); move(ev); });
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', ev => { down = false; canvas.releasePointerCapture?.(ev.pointerId); });
  canvas.addEventListener('pointercancel', () => { down = false; });
  canvas.addEventListener('pointerleave', () => QZ.setPointerCell(state, -1, -1));
};
})();
