window.QZ = window.QZ || {};

QZ.fuc_buildTerrainButtons = function () {
  var box = document.getElementById("terrainButtons");
  box.innerHTML = "";
  QZ.Terrains.forEach(function (terrain) {
    var btn = document.createElement("button");
    btn.dataset.terrainId = String(terrain.id);
    btn.innerHTML = QZ.fuc_makeTerrainButtonHtml(terrain);
    btn.addEventListener("click", function () {
      QZ.State.selectedTerrain = terrain.id;
      QZ.State.mode = "brush";
      QZ.fuc_updateUiState();
    });
    box.appendChild(btn);
  });
};

QZ.fuc_makeTerrainButtonHtml = function (terrain) {
  return '<span class="terrain-dot" style="background:' + terrain.color + '"></span>' + terrain.name;
};
