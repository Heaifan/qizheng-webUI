(function(){
const QZ=window.QZ=window.QZ||{},L=QZ._lf;
// 山地 / 山脊笔刷 — gaussian 隆起
QZ.brushMountain=function(cx,cy,radius,strength){
  return L.pointStamp(cx,cy,radius,(cur,f)=>cur+f*0.22,{strength,falloff:'gaussian'});
};
QZ.brushMountainLine=function(x1,y1,x2,y2,radius,strength){
  return L.lineStamp(x1,y1,x2,y2,radius,(cur,f)=>cur+f*0.22,{strength,falloff:'gaussian'});
};
// 盆地 / 洼地笔刷 — smooth 下凹
QZ.brushBasin=function(cx,cy,radius,strength){
  return L.pointStamp(cx,cy,radius,(cur,f)=>cur-f*0.18,{strength,falloff:'smooth'});
};
// 高原 / 平顶高地笔刷 — plateau falloff 向 target 抬升
QZ.brushPlateau=function(cx,cy,radius,strength,target){
  const tgt=target||0.72;
  return L.pointStamp(cx,cy,radius,(cur,f)=>cur+(tgt-cur)*f*0.5,{strength,falloff:'plateau'});
};
// 山谷 / 河谷笔刷（拖线）
QZ.brushValleyLine=function(x1,y1,x2,y2,radius,strength){
  return L.lineStamp(x1,y1,x2,y2,radius,(cur,f)=>cur-f*0.18,{strength,falloff:'gaussian'});
};
// 平滑笔刷 — 邻域平均
QZ.brushSmooth=function(cx,cy,radius,strength){
  let n=0;const H=QZ.heightMap;
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    const nx=cx+dx,ny=cy+dy;
    if(!QZ.inBounds(nx,ny))continue;
    if(Math.hypot(dx,dy)>radius)continue;
    let sum=0,c=0;
    for(let ky=-1;ky<=1;ky++)for(let kx=-1;kx<=1;kx++){
      if(QZ.inBounds(nx+kx,ny+ky)){sum+=H[ny+ky][nx+kx];c++;}
    }
    const avg=sum/c,cur=H[ny][nx],f=(1-Math.hypot(dx,dy)/radius)*strength;
    QZ.setHeight(nx,ny,cur+(avg-cur)*f*0.4);n++;
  }
  QZ._chm=null;QZ._cht=null;return n;
};
// 统一派发：点模式（用于 click 或 drag 的每个插值点）
QZ._applyLandformPoint=function(cx,cy,state){
  const r=Math.floor(state.brushSize/2),s=state.brushStrength||0.5,t=state.landformType;
  let n=0;
  if(t==='mountain')n=QZ.brushMountain(cx,cy,r,s);
  else if(t==='basin')n=QZ.brushBasin(cx,cy,r,s);
  else if(t==='plateau')n=QZ.brushPlateau(cx,cy,r,s);
  else if(t==='smooth')n=QZ.brushSmooth(cx,cy,r,s);
  if(n){QZ.deriveTerrain();QZ._chm=null;QZ._cht=null;}
  return n;
};
// 统一派发：线段模式（用于山脊/山谷拖线）
QZ._applyLandformLine=function(x1,y1,x2,y2,state){
  const r=Math.floor(state.brushSize/2),s=state.brushStrength||0.5,t=state.landformType;
  let n=0;
  if(t==='mountain')n=QZ.brushMountainLine(x1,y1,x2,y2,r,s);
  else if(t==='valley')n=QZ.brushValleyLine(x1,y1,x2,y2,r,s);
  if(n){QZ.deriveTerrain();QZ._chm=null;QZ._cht=null;}
  return n;
};
})();
