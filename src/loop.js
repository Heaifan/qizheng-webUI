window.QZ = window.QZ || {};

QZ.fuc_startLoop = function () {
  QZ.State.lastFpsTime = performance.now();
  requestAnimationFrame(QZ.fuc_loopFrame);
};

QZ.fuc_loopFrame = function (time) {
  QZ.fuc_updateFps(time);
  if (QZ.State.needsDraw) {
    QZ.fuc_drawScene();
    QZ.fuc_updateStatusText();
    QZ.State.needsDraw = false;
  }
  requestAnimationFrame(QZ.fuc_loopFrame);
};

QZ.fuc_updateFps = function (time) {
  QZ.State.frameCount += 1;
  if (time - QZ.State.lastFpsTime < 500) return;
  QZ.State.fps = Math.round(QZ.State.frameCount * 1000 / (time - QZ.State.lastFpsTime));
  QZ.State.frameCount = 0;
  QZ.State.lastFpsTime = time;
};
