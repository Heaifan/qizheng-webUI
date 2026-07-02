(function(){
const QZ=window.QZ=window.QZ||{};
function inv(){QZ._chm=null;QZ._cht=null;}
function stamp(cx,cy,radius,fn){
  if(radius<1)return 0;let n=0;
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    const nx=cx+dx,ny=cy+dy;
    if(!QZ.inBounds(nx,ny))continue;
    if(dx*dx+dy*dy>radius*radius)continue;
    const f=1-Math.sqrt(dx*dx+dy*dy)/radius;
    const cur=QZ.getHeight(nx,ny),h=Math.max(0,Math.min(1,fn(cur,f)));
    QZ.setHeight(nx,ny,h);n++;
  }
  inv();return n;
}
QZ.raiseHeight=function(cx,cy,radius,targetH){
  return stamp(cx,cy,radius,(cur,f)=>cur+(targetH-cur)*f*0.6);
};
QZ.lowerHeight=function(cx,cy,radius,targetH){
  return stamp(cx,cy,radius,(cur,f)=>cur-(cur-targetH)*f*0.5);
};
// 只降低高处（>0.55），平坦区域不压 — 解决草地误伤坡地
QZ.lowerHeightIfHigh=function(cx,cy,radius,targetH){
  return stamp(cx,cy,radius,(cur,f)=>cur>0.55?cur-(cur-targetH)*f*0.5:cur);
};
QZ.autoHeight=function(cx,cy,radius,terrain){
  if(terrain==='high')return QZ.raiseHeight(cx,cy,radius,0.78);
  if(terrain==='grass')return QZ.lowerHeightIfHigh(cx,cy,radius,0.48);
  if(terrain==='water')return QZ.lowerHeight(cx,cy,radius,0.30);
  return 0;
};
// 统一画笔入口：图层写入 + 高度同步
QZ.paintTerrainStamp=function(cx,cy,terrain,half){
  let p=0;
  for(let y=cy-half;y<=cy+half;y++)for(let x=cx-half;x<=cx+half;x++){
    if(Math.abs(x-cx)+Math.abs(y-cy)<=half+1&&QZ.inBounds(x,y)){QZ.paintCell(x,y,terrain);p++;}
  }
  QZ.autoHeight(cx,cy,half,terrain);return p;
};
// 后处理：扫描所有水体，将高度下切到 0.26~0.35
QZ.syncWaterHeights=function(){
  let n=0;
  for(let y=0;y<QZ.rows;y++)for(let x=0;x<QZ.cols;x++){
    if(QZ.getWater(x,y)&&QZ.getHeight(x,y)>0.35){QZ.setHeight(x,y,0.26+QZ.random()*0.09);n++;}
  }
  if(n){inv();}return n;
};
})();
