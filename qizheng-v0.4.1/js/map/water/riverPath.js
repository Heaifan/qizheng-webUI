(function(){
const QZ = window.QZ = window.QZ || {};
const R = (a,b) => a + QZ.random() * (b - a), RI = (a,b) => Math.floor(R(a, b + 1));
const C = (v,a,b) => Math.max(a, Math.min(b, v)), L = (a,b,t) => a + (b - a) * t;
// 图外端点：河流从地图外自然流入/流出，避免边界裁切
function edgePtOutside(side) {
  const mx = Math.floor(QZ.cols * .12), my = Math.floor(QZ.rows * .12), M = 8 + RI(0, 4);
  if (side === 'top') return { x: RI(mx, QZ.cols - mx), y: -M };
  if (side === 'bottom') return { x: RI(mx, QZ.cols - mx), y: QZ.rows - 1 + M };
  if (side === 'left') return { x: -M, y: RI(my, QZ.rows - my) };
  return { x: QZ.cols - 1 + M, y: RI(my, QZ.rows - my) };
}
// 内部牵引点：入口/出口附近加引导点，避免入图角度突变
function guidePt(from, to, margin) {
  const t = margin / (Math.hypot(to.x - from.x, to.y - from.y) || 1);
  return { x: Math.round(from.x + (to.x - from.x) * t), y: Math.round(from.y + (to.y - from.y) * t) };
}
function genCtrl(start, end) {
  const n = RI(2, 4), amp = Math.min(QZ.cols, QZ.rows) * R(.10, .20);
  const pts = [start];
  // 入图牵引点
  pts.push(guidePt(start, { x: C(start.x, 2, QZ.cols - 3), y: C(start.y, 2, QZ.rows - 3) }, 1));
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1);
    pts.push({ x: C(Math.round(L(start.x, end.x, t) + R(-amp, amp)), 3, QZ.cols - 4),
               y: C(Math.round(L(start.y, end.y, t) + R(-amp, amp)), 3, QZ.rows - 4) });
  }
  // 出图牵引点
  pts.push(guidePt(end, { x: C(end.x, 2, QZ.cols - 3), y: C(end.y, 2, QZ.rows - 3) }, 1));
  pts.push(end);
  return pts;
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
// 保端点 Chaikin：保留 pts[0] 和 pts[last] 不被平滑吃掉
function chaikin(pts) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    out.push({ x: Math.round(pts[i].x * .75 + pts[i + 1].x * .25),
              y: Math.round(pts[i].y * .75 + pts[i + 1].y * .25) });
    out.push({ x: Math.round(pts[i].x * .25 + pts[i + 1].x * .75),
              y: Math.round(pts[i].y * .25 + pts[i + 1].y * .75) });
  }
  out.push(pts[pts.length - 1]);
  return out;
}
QZ.generateRiver = function() {
  const pairs = [['top','bottom'],['left','right'],['right','left'],['top','left'],['top','right'],['left','bottom'],['right','bottom']];
  const pair = pairs[RI(0, pairs.length - 1)], start = edgePtOutside(pair[0]), end = edgePtOutside(pair[1]);
  let pts = genCtrl(start, end);
  for (let i = 0; i < 20 && !validAngle(pts); i++) pts = genCtrl(start, end);
  const smooth = chaikin(chaikin(pts));
  // 沿线连续 stamp
  let totalSteps = 0;
  for (let i = 0; i < smooth.length - 1; i++) totalSteps += 1 + Math.max(Math.abs(smooth[i+1].x - smooth[i].x), Math.abs(smooth[i+1].y - smooth[i].y)) * 2;
  let step = 0;
  for (let i = 0; i < smooth.length - 1; i++) {
    const a = smooth[i], b = smooth[i + 1];
    const seg = 1 + Math.max(Math.abs(b.x - a.x), Math.abs(b.y - a.y)) * 2;
    for (let s = 0; s <= seg; s++, step++) {
      const t = step / totalSteps, x = Math.round(L(a.x, b.x, s / seg)), y = Math.round(L(a.y, b.y, s / seg));
      const r = Math.round(1.2 + Math.sin(t * Math.PI) * .8); // 半径 1~2，中间略宽
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.hypot(dx, dy) <= r + .45) QZ.paintCell(x + dx, y + dy, 'water');
      }
    }
  }
  const outside = start.y < 0 || start.y >= QZ.rows || start.x < 0 || start.x >= QZ.cols;
  QZ.log('河流: ' + pair.join('→') + ' 图外起点=' + outside + ' 控制点=' + pts.length + ' 平滑段=' + smooth.length);
  return pts;
};
})();
