window.QZ = window.QZ || {};

QZ.Pointer = {
  active: false,
  id: null,
  lastX: 0,
  lastY: 0
};

QZ.fuc_resetPointer = function () {
  QZ.Pointer.active = false;
  QZ.Pointer.id = null;
};
