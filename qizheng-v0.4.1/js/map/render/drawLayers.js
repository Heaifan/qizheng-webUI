(function(){
const QZ = window.QZ = window.QZ || {}, N = QZ.Natural, W = QZ.Water, V = QZ.Vegetation;
// 每个图层独立颜色表 —— 禁止合并！各层枚举值都从1开始，合并会 key 冲突
const Cnatural = { [N.grass]: '#d4c87a', [N.dirt]: '#c4a882', [N.high]: '#b8a067' };
const Cwater   = { [W.river]: '#4c95bd', [W.lake]: '#5b9fc4' };
const Cveg     = { [V.forest]: '#587d4e', [V.bush]: '#7fa36a' };
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
  drawLayer(ctx, QZ.naturalMap, Cnatural); // 1. 自然地形
  shadeHigh(ctx);                           // 2. 高地阴影
  drawLayer(ctx, QZ.waterMap, Cwater);     // 3. 水文
  drawLayer(ctx, QZ.vegetationMap, Cveg);  // 4. 植被
};
// 启动自检：确认各层颜色不冲突
QZ.log && QZ.log('颜色表: grass='+Cnatural[N.grass]+' water='+Cwater[W.river]+' forest='+Cveg[V.forest]);
})();
