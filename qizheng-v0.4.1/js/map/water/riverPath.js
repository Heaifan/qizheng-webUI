(function(){
const QZ = window.QZ = window.QZ || {};
const R = (a,b) => a + QZ.random() * (b - a), RI = (a,b) => Math.floor(R(a, b + 1));
const C = (v,a,b) => Math.max(a, Math.min(b, v)), L = (a,b,t) => a + (b - a) * t;
function edgePt(side) {
  const mx = Math.floor(QZ.cols * .12), my = Math.floor(QZ.rows * .12);
  if (side === 'top') return { x: RI(mx, QZ.cols - mx), y: 0 };
  if (side === 'bottom') return { x: RI(mx, QZ.cols - mx), y: QZ.rows - 1 };
  if (side === 'left') return { x: 0, y: RI(my, QZ.rows - my) };
  return { x: QZ.cols - 1, y: RI(my, QZ.rows - my) };
}
function genCtrl(start, end) {
  const n = RI(3, 5), amp = Math.min(QZ.cols, QZ.rows) * R(.12, .24);
  const pts = [{ x: start.x, y: start.y }];
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    pts.push({ x: C(Math.round(L(start.x, end.x, t) + R(-amp, amp)), 1, QZ.cols - 2),
               y: C(Math.round(L(start.y, end.y, t) + R(-amp, amp)), 1, QZ.rows - 2) });
  }
  pts.push({ x: end.x, y: end.y }); return pts;
}
function validAngle(pts) {
  for (let i = 1; i < pts.length - 1; i++) {
    const dx1 = pts[i].x - pts[i - 1].x, dy1 = pts[i].y - pts[i - 1].y;
    const dx2 = pts[i + 1].x - pts[i].x, dy2 = pts[i + 1].y - pts[i].y;
    const dot = dx1 * dx2 + dy1 * dy2;
    const len = Math.hypot(dx1, dy1) * Math.hypot(dx2, dy2);
    if (len > 0 && dot / len < -.4) return false;
  }
  return true;
}
function chaikin(pts) {
  if (pts.length < 3) return pts;
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    out.push({ x: Math.round(pts[i].x * .75 + pts[i + 1].x * .25),
              y: Math.round(pts[i].y * .75 + pts[i + 1].y * .25) });
    out.push({ x: Math.round(pts[i].x * .25 + pts[i + 1].x * .75),
              y: Math.round(pts[i].y * .25 + pts[i + 1].y * .75) });
  }
  return out;
}
QZ.generateRiver = function() {
  const pairs = [['top','bottom'],['left','right'],['right','left'],['top','left'],['top','right'],['left','bottom'],['right','bottom']];
  const pair = pairs[RI(0, pairs.length - 1)], start = edgePt(pair[0]), end = edgePt(pair[1]);
  let pts = genCtrl(start, end);
  for (let i = 0; i < 20 && !validAngle(pts); i++) pts = genCtrl(start, end);
  const smooth = chaikin(chaikin(pts));
  // 沿线连续 stamp：计算总步数，插值宽度渐变
  let totalSteps = 0;
  for (let i = 0; i < smooth.length - 1; i++) totalSteps += 1 + Math.max(Math.abs(smooth[i+1].x - smooth[i].x), Math.abs(smooth[i+1].y - smooth[i].y)) * 2;
  let step = 0;
  for (let i = 0; i < smooth.length - 1; i++) {
    const a = smooth[i], b = smooth[i + 1];
    const seg = 1 + Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) * 2;
    for (let s = 0; s <= seg; s++, step++) {
      const t = step / totalSteps;
      const x = Math.round(a.x + (b.x - a.x) * s / seg);
      const y = Math.round(a.y + (b.y - a.y) * s / seg);
      const r = Math.round(1 + Math.sin(t * Math.PI) * .8);
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.hypot(dx, dy) <= r + .45) QZ.paintCell(x + dx, y + dy, 'water');
      }
    }
  }
  return pts;
};
})();
