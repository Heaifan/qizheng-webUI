window.QZ = window.QZ || {};

QZ.fuc_screenToWorld = function (clientX, clientY) {
  var rect = QZ.State.canvas.getBoundingClientRect();
  return {
    x: clientX - rect.left - QZ.fuc_viewOffsetX() + QZ.State.cameraX,
    y: clientY - rect.top - QZ.fuc_viewOffsetY() + QZ.State.cameraY
  };
};

QZ.fuc_worldToCell = function (worldX, worldY) {
  return {
    col: Math.floor(worldX / QZ.Config.cellSize),
    row: Math.floor(worldY / QZ.Config.cellSize)
  };
};

QZ.fuc_pointerToCell = function (event) {
  var world = QZ.fuc_screenToWorld(event.clientX, event.clientY);
  return QZ.fuc_worldToCell(world.x, world.y);
};
