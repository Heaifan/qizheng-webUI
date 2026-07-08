window.QZ = window.QZ || {};

QZ.fuc_bindUi = function () {
  document.getElementById("modeButton").addEventListener("click", QZ.fuc_toggleMode);
  document.getElementById("brushMinus").addEventListener("click", function () { QZ.fuc_changeBrush(-1); });
  document.getElementById("brushPlus").addEventListener("click", function () { QZ.fuc_changeBrush(1); });
  document.getElementById("clearButton").addEventListener("click", QZ.fuc_clearMap);
};

QZ.fuc_toggleMode = function () {
  QZ.State.mode = QZ.State.mode === "brush" ? "pan" : "brush";
  QZ.fuc_updateUiState();
};

QZ.fuc_changeBrush = function (delta) {
  var next = QZ.State.brushSize + delta;
  QZ.State.brushSize = Math.max(QZ.Config.minBrush, Math.min(QZ.Config.maxBrush, next));
  QZ.fuc_updateUiState();
};
