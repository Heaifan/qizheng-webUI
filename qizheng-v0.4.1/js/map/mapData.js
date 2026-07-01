(function(){
const Terrain=Object.freeze({grass:'grass',road:'road',forest:'forest',water:'water',house:'house',high:'high'});
const Names=Object.freeze({grass:'草地',road:'道路',forest:'树林',water:'水面',house:'房屋',high:'高地'});
const QZ=window.QZ=window.QZ||{};
Object.assign(QZ,{cols:72,rows:128,terrainMap:[],heightMap:[],showContour:false,Terrain,Names});
QZ.makeGrid=function(value){return Array.from({length:QZ.rows},()=>Array(QZ.cols).fill(value));};
QZ.initMap=function(cols=72,rows=128){
  QZ.cols=cols;QZ.rows=rows;QZ.terrainMap=QZ.makeGrid(Terrain.grass);
  QZ.heightMap=Array.from({length:rows},()=>Array(cols).fill(.45));return QZ;
};
QZ.clearTerrain=function(value=Terrain.grass){for(let y=0;y<QZ.rows;y++)QZ.terrainMap[y].fill(value);};
QZ.inBounds=function(x,y){return x>=0&&y>=0&&x<QZ.cols&&y<QZ.rows;};
QZ.getTerrain=function(x,y){return QZ.inBounds(x,y)?QZ.terrainMap[y][x]:null;};
QZ.setTerrain=function(x,y,type){if(QZ.inBounds(x,y))QZ.terrainMap[y][x]=type;};
QZ.setHeight=function(x,y,h){if(QZ.inBounds(x,y))QZ.heightMap[y][x]=Math.max(0,Math.min(1,h));};
QZ.getHeight=function(x,y){return QZ.inBounds(x,y)?QZ.heightMap[y][x]:0;};
QZ.terrainName=function(type){return Names[type]||type;};
QZ.isWater=function(x,y){return QZ.getTerrain(x,y)===Terrain.water;};
QZ.nearTerrain=function(x,y,type,radius){
  for(let yy=y-radius;yy<=y+radius;yy++)for(let xx=x-radius;xx<=x+radius;xx++){
    if(QZ.inBounds(xx,yy)&&QZ.terrainMap[yy][xx]===type)return true;
  }
  return false;
};
QZ.eachCell=function(fn){for(let y=0;y<QZ.rows;y++)for(let x=0;x<QZ.cols;x++)fn(x,y,QZ.terrainMap[y][x]);};
})();
