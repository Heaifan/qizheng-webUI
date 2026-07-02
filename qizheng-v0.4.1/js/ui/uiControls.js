(function(){
const QZ = window.QZ = window.QZ || {};
const $ = s => document.querySelector(s);
QZ.bindControls=function(state,actions){
  // 传统地形笔刷
  const terrainButtons=[...document.querySelectorAll('[data-terrain]')];
  const setTActive=()=>terrainButtons.forEach(b=>b.classList.toggle('active',b.dataset.terrain===state.terrain));
  terrainButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const type=QZ.Terrain[btn.dataset.terrain];
    if(type){QZ.setTerrainType(state,type);QZ.log('选地形: '+type+' → '+QZ.Names[type]);}
    state.brushMode='terrain';setTActive();updateLandformUI();
  }));
  // 地貌笔刷
  const lfButtons=[...document.querySelectorAll('[data-landform]')];
  const setLFActive=()=>lfButtons.forEach(b=>b.classList.toggle('active',b.dataset.landform===state.landformType));
  lfButtons.forEach(btn=>btn.addEventListener('click',()=>{
    state.landformType=btn.dataset.landform;state.brushMode='landform';state.dirty=true;
    QZ.log('选地貌: '+state.landformType);setLFActive();updateLandformUI();
  }));
  function updateLandformUI(){
    const isLF=state.brushMode==='landform';
    $('#landformModeBtn').textContent=isLF?'地貌模式':'地表模式';
    lfButtons.forEach(b=>b.classList.toggle('hide',!isLF));
    terrainButtons.forEach(b=>b.classList.toggle('hide',isLF));
  }
  // 地貌模式切换
  $('#landformModeBtn').addEventListener('click',()=>{
    state.brushMode=state.brushMode==='landform'?'terrain':'landform';state.dirty=true;
    updateLandformUI();setLFActive();setTActive();
  });
  document.querySelector('#brushDown').addEventListener('click',()=>QZ.changeBrush(state,-1));
  document.querySelector('#brushUp').addEventListener('click',()=>QZ.changeBrush(state,1));
  document.querySelector('#clearBtn').addEventListener('click',actions.clear);
  document.querySelector('#randomBtn').addEventListener('click',actions.random);
  document.querySelector('#contourBtn').addEventListener('click',()=>{
    QZ.showContour=!QZ.showContour;QZ._contourLogNeeded=true;state.dirty=true;
    document.querySelector('#contourBtn').textContent='等高线：'+(QZ.showContour?'开':'关');
  });
  const modeBtn=document.querySelector('#modeBtn');
  modeBtn.addEventListener('click',()=>{
    const mode=QZ.toggleMode(state);modeBtn.textContent=`模式：${mode==='brush'?'画笔':'查看'}`;
  });
  setTActive();updateLandformUI();
};
})();
