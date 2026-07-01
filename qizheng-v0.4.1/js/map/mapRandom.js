(function(){
const QZ=window.QZ,T=QZ.Terrain;
const R=(a,b)=>a+Math.random()*(b-a),RI=(a,b)=>Math.floor(R(a,b+1));
const C=(v,a,b)=>Math.max(a,Math.min(b,v)),L=(a,b,t)=>a+(b-a)*t;
QZ.generateRandomMap=function(){
  QZ.clearTerrain(T.grass);buildHeight();baseTerrain();QZ.generateForestPatches();
  const river=makeRiver(),houses=makeHouses();connectHouses(houses);decorate();return{river,houses};
};
function buildHeight(){
  const ax=R(.02,.06),ay=R(.02,.06),px=R(0,9),py=R(0,9),slope=R(-.25,.25);
  for(let y=0;y<QZ.rows;y++)for(let x=0;x<QZ.cols;x++){
    const nx=x/QZ.cols,wave=Math.sin((x+px)*ax)+Math.cos((y+py)*ay);
    const ridge=Math.sin((x*.07+y*.035)+px)*.08;
    QZ.setHeight(x,y,C(.48+wave*.13+ridge+(nx-.5)*slope+Math.random()*.08,0,1));
  }
}
function baseTerrain(){
  for(let y=0;y<QZ.rows;y++)for(let x=0;x<QZ.cols;x++){
    if(QZ.heightMap[y][x]>.72)QZ.setTerrain(x,y,T.high);
    else QZ.setTerrain(x,y,T.grass);
  }
}
function edgePoint(side){
  const mx=Math.floor(QZ.cols*.12),my=Math.floor(QZ.rows*.12);
  if(side==='top')return{x:RI(mx,QZ.cols-mx),y:0};
  if(side==='bottom')return{x:RI(mx,QZ.cols-mx),y:QZ.rows-1};
  if(side==='left')return{x:0,y:RI(my,QZ.rows-my)};
  return{x:QZ.cols-1,y:RI(my,QZ.rows-my)};
}
function makeRiver(){
  const pairs=[['top','bottom'],['left','right'],['right','left'],['top','left'],['top','right'],['left','bottom'],['right','bottom']];
  const pair=pairs[RI(0,pairs.length-1)],start=edgePoint(pair[0]),end=edgePoint(pair[1]);
  const count=RI(3,5),amp=Math.min(QZ.cols,QZ.rows)*R(.12,.24),pts=[start];
  for(let i=1;i<=count;i++){
    const t=i/(count+1),ox=R(-amp,amp),oy=R(-amp,amp);
    pts.push({x:C(Math.round(L(start.x,end.x,t)+ox),1,QZ.cols-2),y:C(Math.round(L(start.y,end.y,t)+oy),1,QZ.rows-2)});
  }
  pts.push(end);for(let i=0;i<pts.length-1;i++)line(pts[i],pts[i+1],T.water,RI(2,5),999);
  return pts;
}
function line(a,b,type,width,waterBudget){
  const dx=b.x-a.x,dy=b.y-a.y,steps=Math.max(Math.abs(dx),Math.abs(dy))*2+1;let budget=waterBudget;
  for(let i=0;i<=steps;i++){
    const x=Math.round(L(a.x,b.x,i/steps)),y=Math.round(L(a.y,b.y,i/steps));
    budget=stamp(x,y,width,type,budget);
  }
  return budget;
}
function stamp(cx,cy,w,type,budget){
  const r=Math.max(0,Math.floor(w/2));
  for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){
    if(!QZ.inBounds(x,y)||Math.hypot(x-cx,y-cy)>r+.45)continue;
    if(type===T.road&&QZ.getTerrain(x,y)===T.water){if(budget--<=0)continue;}
    QZ.setTerrain(x,y,type);
  }
  return budget;
}
function farFrom(list,x,y,minD){return list.every(p=>Math.hypot(p.x-x,p.y-y)>=minD);}
function makeHouses(){
  const want=RI(4,7),list=[];
  for(let tries=0;tries<700&&list.length<want;tries++){
    const x=RI(5,QZ.cols-6),y=RI(5,QZ.rows-6);
    if(QZ.nearTerrain(x,y,T.water,5)||!farFrom(list,x,y,9))continue;
    list.push({x,y});stamp(x,y,2,T.house,0);
  }
  return list;
}
function connectHouses(houses){
  houses.sort((a,b)=>a.y-b.y||a.x-b.x);
  for(let i=0;i<houses.length-1;i++)roadBetween(houses[i],houses[i+1]);
  if(houses.length>4)roadBetween(houses[0],houses[RI(2,houses.length-1)]);
}
function roadBetween(a,b){
  const mid={x:Math.round((a.x+b.x)/2+R(-8,8)),y:Math.round((a.y+b.y)/2+R(-10,10))};
  const p={x:C(mid.x,2,QZ.cols-3),y:C(mid.y,2,QZ.rows-3)};
  let budget=10;budget=line(a,p,T.road,1,budget);line(p,b,T.road,1,budget);
  stamp(a.x,a.y,2,T.house,0);stamp(b.x,b.y,2,T.house,0);
}
function decorate(){
  for(let i=0;i<25;i++){
    const x=RI(2,QZ.cols-3),y=RI(2,QZ.rows-3);
    if(QZ.getTerrain(x,y)===T.grass)QZ.setTerrain(x,y,T.forest);
  }
}
})();
