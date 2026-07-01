(function(){
const QZ = window.QZ, N = QZ.Natural, W = QZ.Water, V = QZ.Vegetation;
const S = QZ.Surface, R = QZ.Road, B = QZ.Building;
const C = {
  [N.grass]: '#9fbe77', [N.dirt]: '#c4a882', [N.high]: '#b8a067',
  [W.river]: '#4c95bd', [W.lake]: '#5b9fc4',
  [V.forest]: '#587d4e', [V.bush]: '#7fa36a',
  [S.concrete]: '#b8b0a0', [S.yard]: '#c8bea8',
  [R.path]: '#c7aa70', [R.road]: '#c7aa70', [R.bridge]: '#b89860',
  [B.house]: '#b76d4d', [B.warehouse]: '#a06040',
};
function fill(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(QZ.offsetX + x * QZ.cellSize, QZ.offsetY + y * QZ.cellSize, QZ.cellSize + 1, QZ.cellSize + 1);
}
function drawLayer(ctx, map, colors) {
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    const v = map[y][x];
    if (v) fill(ctx, x, y, colors[v] || colors[1]);
  }
}
function shadeHigh(ctx) {
  for (let y = 0; y < QZ.rows; y++) for (let x = 0; x < QZ.cols; x++) {
    if (QZ.naturalMap[y][x] !== N.high) continue;
    const h = QZ.heightMap[y][x];
    if (h < .55) continue;
    ctx.globalAlpha = Math.min(.18, (h - .55) * .45);
    fill(ctx, x, y, '#fff2b2');
    ctx.globalAlpha = 1;
  }
}
QZ.renderLayers = function(ctx) {
  drawLayer(ctx, QZ.naturalMap, C);        // 1. 自然地形
  shadeHigh(ctx);                           // 2. 高地阴影
  drawLayer(ctx, QZ.waterMap, C);          // 3. 水体
  drawLayer(ctx, QZ.surfaceMap, C);        // 4. 人为地表
  drawLayer(ctx, QZ.roadMap, C);           // 5. 道路
  drawLayer(ctx, QZ.vegetationMap, C);     // 6. 植被
  drawLayer(ctx, QZ.buildingMap, C);       // 7. 建筑物
};
})();
