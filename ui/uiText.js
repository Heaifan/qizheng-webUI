window.QZ = window.QZ || {};

QZ.fuc_updateStatusText = function () {
  var mode = QZ.State.mode === "brush" ? "画笔" : "拖图";
  var terrain = QZ.fuc_getTerrain(QZ.State.selectedTerrain);
  var info = QZ.fuc_getCellInfoText();
  document.getElementById("statusText").textContent =
    QZ.fuc_getLayoutName() + "｜模式:" + mode + "｜地形:" + terrain.name +
    "｜笔:" + QZ.State.brushSize + "格｜" + info + "｜FPS:" + QZ.State.fps;
};

QZ.fuc_getCellInfoText = function () {
  var cell = QZ.State.lastPaintCell || QZ.State.lastCell;
  if (!cell) return "格:-,-";
  return "格:" + cell.col + "," + cell.row;
};

QZ.fuc_getLayoutName = function () {
  return QZ.State.isPortrait ? "竖屏" : "横屏";
};
