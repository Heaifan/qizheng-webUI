(function(){
const QZ=window.QZ;
QZ.createUiState=function(){
  return{mode:'brush',terrain:QZ.Terrain.grass,brushSize:4,cellX:-1,cellY:-1,fps:0,dirty:true};
};
QZ.setTerrainType=function(state,type){state.terrain=type;state.dirty=true;};
QZ.toggleMode=function(state){
  state.mode=state.mode==='brush'?'inspect':'brush';state.dirty=true;return state.mode;
};
QZ.changeBrush=function(state,delta){
  state.brushSize=Math.max(1,Math.min(10,state.brushSize+delta));state.dirty=true;
};
QZ.setPointerCell=function(state,x,y){
  if(state.cellX===x&&state.cellY===y)return;
  state.cellX=x;state.cellY=y;state.dirty=true;
};
QZ.updateFps=function(state,now){
  state._last=state._last||now;state._frames=(state._frames||0)+1;
  if(now-state._last>500){
    state.fps=Math.round(state._frames*1000/(now-state._last));
    state._frames=0;state._last=now;state.dirty=true;
  }
};
QZ.statusText=function(state,portrait){
  const dir=portrait?'竖屏':'横屏',mode=state.mode==='brush'?'画笔':'查看';
  const cell=state.cellX>=0?` | 格:${state.cellX},${state.cellY}`:'';
  return`${dir} | 模式:${mode} | 地形:${QZ.terrainName(state.terrain)} | 笔:${state.brushSize}格${cell} | Seed:${QZ.lastSeed} | FPS:${state.fps}`;
};
})();
