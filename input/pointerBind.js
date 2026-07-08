window.QZ = window.QZ || {};

QZ.fuc_bindPointer = function () {
  var canvas = QZ.State.canvas;
  canvas.addEventListener("pointerdown", QZ.fuc_onPointerDown);
  canvas.addEventListener("pointermove", QZ.fuc_onPointerMove);
  canvas.addEventListener("pointerup", QZ.fuc_onPointerUp);
  canvas.addEventListener("pointercancel", QZ.fuc_onPointerUp);
  canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); });
};

QZ.fuc_onPointerDown = function (event) {
  event.preventDefault();
  QZ.State.canvas.setPointerCapture(event.pointerId);
  QZ.fuc_savePointer(event);
  QZ.State.lastPaintCell = null;
  if (QZ.State.mode === "brush") QZ.fuc_handleBrushPointer(event);
};

QZ.fuc_onPointerMove = function (event) {
  if (!QZ.Pointer.active || !QZ.fuc_isPrimaryPointer(event)) return;
  event.preventDefault();
  if (QZ.State.mode === "brush") QZ.fuc_handleBrushPointer(event);
  if (QZ.State.mode === "pan") QZ.fuc_handlePanPointer(event);
};

QZ.fuc_onPointerUp = function (event) {
  if (!QZ.fuc_isPrimaryPointer(event)) return;
  QZ.State.lastPaintCell = null;
  QZ.fuc_resetPointer();
};
