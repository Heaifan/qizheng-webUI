window.QZ = window.QZ || {};

QZ.fuc_isPrimaryPointer = function (event) {
  return QZ.Pointer.id === null || QZ.Pointer.id === event.pointerId;
};

QZ.fuc_savePointer = function (event) {
  QZ.Pointer.active = true;
  QZ.Pointer.id = event.pointerId;
  QZ.Pointer.lastX = event.clientX;
  QZ.Pointer.lastY = event.clientY;
};
