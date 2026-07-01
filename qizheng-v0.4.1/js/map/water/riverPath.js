(function(){
const QZ = window.QZ, T = QZ.Terrain;
const R = (a,b) => a + QZ.random() * (b - a);
const RI = (a,b) => Math.floor(R(a, b + 1));
const C = (v,a,b) => Math.max(a, Math.min(b, v));
const L = (a,b,t) => a + (b - a) * t;
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
function circleStamp(cx, cy, r) {
  for (let y = cy - r; y <= cy + r; y++) for (let x = cx - r; x <= cx + r; x++) {
    if (QZ.inBounds(x, y) && Math.hypot(x - cx, y - cy) <= r + .45) QZ.setTerrain(x, y, T.water);
  }
}
QZ.generateRiver = function() {
  const pairs = [['top','bottom'],['left','right'],['right','left'],['top','left'],['top','right'],['left','bottom'],['right','bottom']];
  const pair = pairs[RI(0, pairs.length - 1)], start = edgePt(pair[0]), end = edgePt(pair[1]);
  let pts = genCtrl(start, end);
  for (let i = 0; i < 20 && !validAngle(pts); i++) pts = genCtrl(start, end);
  const smooth = chaikin(chaikin(pts));
  for (let i = 0; i < smooth.length; i++) {
    const t = i / Math.max(1, smooth.length - 1);
    circleStamp(smooth[i].x, smooth[i].y, Math.round(1 + Math.sin(t * Math.PI) * .8));
  }
  return pts;
};
})();
