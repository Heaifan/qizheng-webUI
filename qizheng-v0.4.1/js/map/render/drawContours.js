(function(){
const QZ=window.QZ=window.QZ||{},N=QZ.Natural;
function buildCHM(){
  const rows=QZ.rows,cols=QZ.cols;
  if(!QZ._chm)QZ._chm=Array.from({length:rows},()=>Array(cols).fill(0));
  if(!QZ._cht)QZ._cht=Array.from({length:rows},()=>Array(cols).fill(0));
  const src=QZ.heightMap,dst=QZ._chm,tmp=QZ._cht;
  for(let p=0;p<2;p++){
    const inArr=p===0?src:dst;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      let s=inArr[y][x],n=1;
      if(x>0){s+=inArr[y][x-1];n++;}
      if(x<cols-1){s+=inArr[y][x+1];n++;}
      tmp[y][x]=s/n;
    }
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      let s=tmp[y][x],n=1;
      if(y>0){s+=tmp[y-1][x];n++;}
      if(y<rows-1){s+=tmp[y+1][x];n++;}
      dst[y][x]=s/n;
    }
  }
  return dst;
}
function relief(hm,x,y){
  const a=hm[y][x],b=hm[y][x+1],c=hm[y+1][x],d=hm[y+1][x+1];
  return Math.max(a,b,c,d)-Math.min(a,b,c,d);
}
// 2×2 block 周围 3×3 是否有高地
function nearHigh(x,y){
  for(let dy=-1;dy<=2;dy++)for(let dx=-1;dx<=2;dx++){
    const nx=x+dx,ny=y+dy;
    if(QZ.inBounds(nx,ny)&&QZ.getNatural(nx,ny)===N.high)return true;
  }
  return false;
}
function drawLevel(ctx,level,color,lw,oX,oY,cs,CH,bt,ht){
  let seg=0,skip=0;ctx.strokeStyle=color;ctx.lineWidth=lw;
  const rows=QZ.rows,cols=QZ.cols;
  for(let y=0;y<rows-1;y++)for(let x=0;x<cols-1;x++){
    if(QZ.getWater(x,y)&&QZ.getWater(x+1,y)&&QZ.getWater(x,y+1)&&QZ.getWater(x+1,y+1))continue;
    if(relief(CH,x,y)<(nearHigh(x,y)?ht:bt)){skip++;continue;}
    const tl=CH[y][x]>=level,tr=CH[y][x+1]>=level;
    const bl=CH[y+1][x]>=level,br=CH[y+1][x+1]>=level;
    const code=(tl<<3)|(tr<<2)|(bl<<1)|br;
    if(!code||code===15)continue;
    const pts=[];
    for(const[x1,y1,x2,y2]of[[x,y,x+1,y],[x+1,y,x+1,y+1],[x,y+1,x+1,y+1],[x,y,x,y+1]]){
      const h1=CH[y1][x1],h2=CH[y2][x2];
      if((h1<level)!==(h2<level)){
        const t=(level-h1)/(h2-h1);
        pts.push({x:(x1+(x2-x1)*t)*cs+oX,y:(y1+(y2-y1)*t)*cs+oY});
      }
    }
    if(pts.length<2)continue;
    seg++;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);ctx.lineTo(pts[1].x,pts[1].y);ctx.stroke();
    if(pts.length===4){ctx.beginPath();ctx.moveTo(pts[2].x,pts[2].y);ctx.lineTo(pts[3].x,pts[3].y);ctx.stroke();}
  }
  return{seg,skip};
}
// 高地边界辅助线：high→non-high 边缘画极淡褐灰
function drawHighEdge(ctx,oX,oY,cs){
  ctx.save();ctx.strokeStyle='rgba(80,72,48,0.14)';ctx.lineWidth=0.5;let seg=0;
  for(let y=0;y<QZ.rows;y++)for(let x=0;x<QZ.cols;x++){
    if(QZ.getNatural(x,y)!==N.high)continue;
    if(x+1<QZ.cols&&QZ.getNatural(x+1,y)!==N.high){
      const px=(x+1)*cs+oX;ctx.beginPath();ctx.moveTo(px,y*cs+oY);ctx.lineTo(px,(y+1)*cs+oY);ctx.stroke();seg++;
    }
    if(y+1<QZ.rows&&QZ.getNatural(x,y+1)!==N.high){
      const py=(y+1)*cs+oY;ctx.beginPath();ctx.moveTo(x*cs+oX,py);ctx.lineTo((x+1)*cs+oX,py);ctx.stroke();seg++;
    }
  }
  ctx.restore();return seg;
}
QZ.drawContours=function(ctx){
  if(!QZ.showContour||!QZ.cellSize)return;
  ctx.save();const oX=QZ.offsetX,oY=QZ.offsetY,cs=QZ.cellSize;
  const CH=buildCHM();let minH=1,maxH=0;
  for(let y=0;y<QZ.rows;y++)for(let x=0;x<QZ.cols;x++){const h=CH[y][x];if(h<minH)minH=h;if(h>maxH)maxH=h;}
  const range=Math.max(maxH-minH,0.06),margin=range*0.08;
  const lo=+(minH+margin).toFixed(3),hi=+(maxH-margin).toFixed(3);
  const lvls=Array.from({length:6},(_,i)=>+(lo+(hi-lo)*i/5).toFixed(3));
  const bt=Math.max(0.015,range*0.035),ht=0.010;
  const S=[{lw:.45,a:.14},{lw:.85,a:.26},{lw:.45,a:.14},{lw:.85,a:.28},{lw:.45,a:.16},{lw:1,a:.34}];
  let ts=0,tk=0;
  for(let i=0;i<6;i++){const r=drawLevel(ctx,lvls[i],'rgba(80,72,48,'+S[i].a+')',S[i].lw,oX,oY,cs,CH,bt,ht);ts+=r.seg;tk+=r.skip;}
  const es=QZ.showHighEdge?drawHighEdge(ctx,oX,oY,cs):0;ctx.restore();
  if(QZ._contourLogNeeded){
    const rs=QZ._reliefStats||{},m=lvls.filter((_,i)=>i%2===1);
    QZ.log('等高线: enabled='+QZ.showContour+' mode=smooth-linked passes=2'+
      ' levels=['+lvls.join(',')+'] major=['+m.join(',')+']'+
      ' bt='+bt.toFixed(3)+' ht='+ht.toFixed(3)+' seg='+ts+' skip='+tk+' edge='+es+
      ' reliefTint='+(rs.tint||0)+' slopeShade='+(rs.slope||0)+' highEdge='+(QZ.showHighEdge?'on':'off'));
    QZ._contourLogNeeded=false;
  }
};
})();
