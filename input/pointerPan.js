window.QZ = window.QZ || {};

QZ.fuc_handlePanPointer = function (event) {
  var dx = event.clientX - QZ.Pointer.lastX;
  var dy = event.clientY - QZ.Pointer.lastY;
  QZ.State.cameraX -= dx * QZ.Config.cameraStep;
  QZ.State.cameraY -= dy * QZ.Config.cameraStep;
  QZ.Pointer.lastX = event.clientX;
  QZ.Pointer.lastY = event.clientY;
  QZ.fuc_clampCamera();
  QZ.State.needsDraw = true;
};
