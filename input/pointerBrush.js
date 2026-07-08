window.QZ = window.QZ || {};

QZ.fuc_handleBrushPointer = function (event) {
  var cell = QZ.fuc_pointerToCell(event);
  if (QZ.fuc_shouldSkipSamePaintCell(cell)) return;
  QZ.fuc_applyBrushLine(QZ.State.lastPaintCell, cell);
  QZ.State.lastPaintCell = { col: cell.col, row: cell.row };
  QZ.State.needsDraw = true;
  QZ.fuc_updateStatusText();
};

QZ.fuc_shouldSkipSamePaintCell = function (cell) {
  var last = QZ.State.lastPaintCell;
  return last && last.col === cell.col && last.row === cell.row;
};
