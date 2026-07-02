(function(){
const QZ=window.QZ=window.QZ||{},N=QZ.Natural;
// 根据 heightMap 自动派生 naturalMap / 清除等高线缓存
QZ.deriveTerrain=function(){
  const rows=QZ.rows,cols=QZ.cols,H=QZ.heightMap;
  // 收集非水体高度
  const vals=[];
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    if(!QZ.getWater(x,y))vals.push(H[y][x]);
  }
  vals.sort((a,b)=>b-a);
  if(!vals.length)return{high:0,low:0};
  const highN=Math.floor(vals.length*0.12),lowN=Math.floor(vals.length*0.2);
  const highT=vals[Math.min(highN,vals.length-1)],lowT=vals[Math.min(lowN,vals.length-1)];
  // 更新 naturalMap（水体格跳过）
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
    if(QZ.getWater(x,y))continue;
    const h=H[y][x];
    QZ.setNatural(x,y,h>=highT?N.high:(h<=lowT?N.dirt:N.grass));
  }
  QZ._chm=null;QZ._cht=null;
  return{high:highN,low:lowN,highT:highT.toFixed(3),lowT:lowT.toFixed(3)};
};
})();
