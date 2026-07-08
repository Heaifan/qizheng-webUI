window.QZ = window.QZ || {};

QZ.fuc_updateUiState = function () {
  QZ.fuc_updateModeButton();
  QZ.fuc_updateTerrainActive();
  QZ.fuc_updateStatusText();
  QZ.State.needsDraw = true;
};

QZ.fuc_updateModeButton = function () {
  document.getElementById("modeButton").textContent = "模式：" + QZ.fuc_modeName();
};

QZ.fuc_updateTerrainActive = function () {
  var buttons = document.querySelectorAll("[data-terrain-id]");
  buttons.forEach(function (btn) {
    var same = Number(btn.dataset.terrainId) === QZ.State.selectedTerrain;
    btn.classList.toggle("active", same);
  });
};
