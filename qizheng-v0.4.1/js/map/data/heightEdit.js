(function(){
const QZ=window.QZ=window.QZ||{};
function inv(){QZ._chm=null;QZ._cht=null;}
function stamp(cx,cy,radius,fn){
  if(radius<1)return 0;
  let n=0;
  for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
    const nx=cx+dx,ny=cy+dy;
    if(!QZ.inBounds(nx,ny))continue;
    if(dx*dx+dy*dy>radius*radius)continue;
    const f=1-Math.sqrt(dx*dx+dy*dy)/radius; // 1中心→0边缘
    const cur=QZ.getHeight(nx,ny),h=Math.max(0,Math.min(1,fn(cur,f)));
    QZ.setHeight(nx,ny,h);n++;
  }
  inv();return n;
}
// 以圆形 falloff 向 targetH 抬高
QZ.raiseHeight=function(cx,cy,radius,targetH){
  return stamp(cx,cy,radius,(cur,f)=>cur+(targetH-cur)*f*0.6);
};
// 以圆形 falloff 向 targetH 降低
QZ.lowerHeight=function(cx,cy,radius,targetH){
  return stamp(cx,cy,radius,(cur,f)=>cur-(cur-targetH)*f*0.5);
};
// 根据地类自动选择高度修改
QZ.autoHeight=function(cx,cy,radius,terrain){
  if(terrain==='high')return QZ.raiseHeight(cx,cy,radius,0.78);
  if(terrain==='grass')return QZ.lowerHeight(cx,cy,radius,0.48);
  if(terrain==='water')return QZ.lowerHeight(cx,cy,radius,0.30);
  return 0;
};
})();
