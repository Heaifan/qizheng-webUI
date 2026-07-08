window.QZ = window.QZ || {};

QZ.fuc_applyBrushAtCell = function (centerCol, centerRow) {
  var half = Math.floor((QZ.State.brushSize - 1) / 2);
  for (var row = centerRow - half; row <= centerRow + half; row += 1) {
    for (var col = centerCol - half; col <= centerCol + half; col += 1) {
      QZ.fuc_setCell(col, row, QZ.State.selectedTerrain);
    }
  }
};

QZ.fuc_applyBrushLine = function (fromCell, toCell) {
  if (!fromCell) {
    QZ.fuc_applyBrushAtCell(toCell.col, toCell.row);
    return;
  }
  QZ.fuc_walkLineCells(fromCell, toCell, QZ.fuc_applyBrushAtCell);
};

QZ.fuc_walkLineCells = function (fromCell, toCell, visit) {
  var x0 = fromCell.col, y0 = fromCell.row;
  var x1 = toCell.col, y1 = toCell.row;
  var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  var dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  var err = dx + dy;
  while (true) {
    visit(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    var e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
};

QZ.fuc_clearMap = function () {
  QZ.Map.data.fill(QZ.Config.defaultTerrain);
  QZ.fuc_fillTerrainCanvas(QZ.Config.defaultTerrain);
  QZ.State.lastCell = null;
  QZ.State.lastPaintCell = null;
  QZ.State.needsDraw = true;
};
