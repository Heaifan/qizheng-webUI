window.QZ = window.QZ || {};

QZ.State = {
  canvas: null,
  ctx: null,
  dpr: 1,
  viewW: 0,
  viewH: 0,
  cameraX: 0,
  cameraY: 0,
  mode: "brush",
  selectedTerrain: 2,
  brushSize: QZ.Config.startBrush,
  lastCell: null,
  lastPaintCell: null,
  frameCount: 0,
  fps: 0,
  lastFpsTime: 0,
  needsDraw: true
};
