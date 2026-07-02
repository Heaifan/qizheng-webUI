(function(){
const QZ=window.QZ=window.QZ||{};
// 衰减函数：linear / smooth(smoothstep) / gaussian / plateau
function falloff(dist,radius,type){
  if(dist>=radius)return 0;const t=dist/radius;
  switch(type){
    case'smooth':const s=1-t;return s*s*(3-2*s);
    case'gaussian':return Math.exp(-4.5*t*t);
    case'plateau':return t<0.4?1:1-(t-0.4)/0.6;
    default:return 1-t; // linear
  }
}
// 点到线段距离
function distSeg(px,py,x1,y1,x2,y2){
  const dx=x2-x1,dy=y2-y1,ls=dx*dx+dy*dy;
  if(ls===0)return Math.hypot(px-x1,py-y1);
  let t=((px-x1)*dx+(py-y1)*dy)/ls;t=t<0?0:t>1?1:t;
  return Math.hypot(px-(x1+t*dx),py-(y1+t*dy));
}
// 圆形 stamp（用于点状笔刷）
function pointStamp(cx,cy,radius,fn,opt){
  let n=0;const str=opt.strength||1,ft=opt.falloff||'smooth';
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    const nx=cx+dx,ny=cy+dy;
    if(!QZ.inBounds(nx,ny))continue;
    const d=Math.hypot(dx,dy);if(d>radius)continue;
    const f=falloff(d,radius,ft)*str;
    const cur=QZ.getHeight(nx,ny),h=fn(cur,f);
    QZ.setHeight(nx,ny,Math.max(0,Math.min(1,h)));n++;
  }
  return n;
}
// 线段 stamp（用于山脊/山谷拖线）
function lineStamp(x1,y1,x2,y2,radius,fn,opt){
  if(radius<1)return 0;let n=0;const str=opt.strength||1,ft=opt.falloff||'gaussian';
  const mx=Math.max(0,Math.min(x1,x2)-radius),Mx=Math.min(QZ.cols-1,Math.max(x1,x2)+radius);
  const my=Math.max(0,Math.min(y1,y2)-radius),My=Math.min(QZ.rows-1,Math.max(y1,y2)+radius);
  for(let y=my;y<=My;y++)for(let x=mx;x<=Mx;x++){
    const d=distSeg(x,y,x1,y1,x2,y2);if(d>radius)continue;
    const f=falloff(d,radius,ft)*str;
    const cur=QZ.getHeight(x,y),h=fn(cur,f);
    QZ.setHeight(x,y,Math.max(0,Math.min(1,h)));n++;
  }
  return n;
}
QZ._lf={falloff,distSeg,pointStamp,lineStamp};
})();
