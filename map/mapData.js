window.QZ = window.QZ || {};

QZ.Map = {
  data: null,
  terrainCanvas: null,
  terrainCtx: null
};

QZ.fuc_initMapData = function () {
  var total = QZ.Config.mapCols * QZ.Config.mapRows;
  QZ.Map.data = new Uint8Array(total);
  QZ.Map.data.fill(QZ.Config.defaultTerrain);
};

QZ.fuc_mapIndex = function (col, row) {
  return row * QZ.Config.mapCols + col;
};

QZ.fuc_mapPixelW = function () {
  return QZ.Config.mapCols * QZ.Config.cellSize;
};

QZ.fuc_mapPixelH = function () {
  return QZ.Config.mapRows * QZ.Config.cellSize;
};

QZ.fuc_setCell = function (col, row, terrainId) {
  if (col < 0 || row < 0 || col >= QZ.Config.mapCols || row >= QZ.Config.mapRows) return false;
  var idx = QZ.fuc_mapIndex(col, row);
  if (QZ.Map.data[idx] === terrainId) return false;
  QZ.Map.data[idx] = terrainId;
  QZ.fuc_redrawTerrainCell(col, row);
  return true;
};

QZ.fuc_getCell = function (col, row) {
  if (col < 0 || row < 0 || col >= QZ.Config.mapCols || row >= QZ.Config.mapRows) return 0;
  return QZ.Map.data[QZ.fuc_mapIndex(col, row)];
};
