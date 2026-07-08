window.QZ = window.QZ || {};

QZ.fuc_initApp = function () {
  QZ.fuc_initMapData();
  QZ.fuc_initTerrainCanvas();
  QZ.fuc_initCanvas();
  QZ.fuc_buildTerrainButtons();
  QZ.fuc_bindUi();
  QZ.fuc_bindPointer();
  QZ.fuc_updateUiState();
  QZ.fuc_startLoop();
};

window.addEventListener("DOMContentLoaded", QZ.fuc_initApp);
