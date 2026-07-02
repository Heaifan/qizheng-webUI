(function(){
const QZ=window.QZ=window.QZ||{},N=QZ.Natural;
// 根据 heightMap 自动派生 naturalMap（只更新 dirtyRect 区域）
// dirtyRect = {minX,minY,maxX,maxY}，不传则全图更新
QZ.deriveTerrain=function(dirtyRect){
  const rows=QZ.rows,cols=QZ.cols,H=QZ.heightMap;
  // 全图阈值计算（不写全图）
  const vals=[];
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    if(!QZ.getWater(x,y))vals.push(H[y][x]);
  }
  vals.sort((a,b)=>b-a);
  if(!vals.length)return{};
  const highN=Math.floor(vals.length*0.12);
  const highT=vals[Math.min(highN,vals.length-1)];
  // dirtyRect 范围界定
  const mx=dirtyRect?Math.max(0,dirtyRect.minX-1):0;
  const Mx=dirtyRect?Math.min(cols-1,dirtyRect.maxX+1):cols-1;
  const my=dirtyRect?Math.max(0,dirtyRect.minY-1):0;
  const My=dirtyRect?Math.min(rows-1,dirtyRect.maxY+1):rows-1;
  // 仅更新范围内 naturalMap（只设 high，低地保持 grass）
  let changed=0;
  for(let y=my;y<=My;y++)for(let x=mx;x<=Mx;x++){
    if(QZ.getWater(x,y))continue;
    const h=H[y][x],desired=h>=highT?N.high:N.grass;
    if(QZ.getNatural(x,y)!==desired){QZ.setNatural(x,y,desired);changed++;}
  }
  QZ._chm=null;QZ._cht=null;
  return{high:highN,highT:highT.toFixed(3),changed,rect:{mx,Mx,my,My}};
};
})();
