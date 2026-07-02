(function(){
const QZ=window.QZ=window.QZ||{};
// 地势底色 + 坡度阴影 — 让地图不依赖等高线也能看清高低起伏
QZ.drawRelief=function(ctx){
  if(!QZ.cellSize)return;
  const oX=QZ.offsetX,oY=QZ.offsetY,cs=QZ.cellSize;
  const H=QZ.heightMap,rows=QZ.rows,cols=QZ.cols;
  ctx.save();let tint=0,slope=0;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    const h=H[y][x],dev=h-0.48,ta=Math.abs(dev)*0.35;
    // 高度底色：低处略冷暗，高处略暖亮
    if(ta>0.015){
      ctx.fillStyle=dev>0?'rgba(220,200,160,'+Math.min(ta,0.10).toFixed(3)+')':'rgba(80,100,130,'+Math.min(ta,0.08).toFixed(3)+')';
      ctx.fillRect(oX+x*cs,oY+y*cs,cs+1,cs+1);tint++;
    }
    // 坡度阴影：利用相邻格高度差估算
    if(x<1||x>=cols-1||y<1||y>=rows-1)continue;
    const dx=H[y][x+1]-H[y][x-1],dy=H[y+1][x]-H[y-1][x];
    const s=Math.sqrt(dx*dx+dy*dy);
    if(s>0.025){ctx.fillStyle='rgba(35,30,20,'+Math.min(0.08,s*0.4).toFixed(3)+')';ctx.fillRect(oX+x*cs,oY+y*cs,cs+1,cs+1);slope++;}
  }
  ctx.restore();QZ._reliefStats={tint,slope};
};
})();
