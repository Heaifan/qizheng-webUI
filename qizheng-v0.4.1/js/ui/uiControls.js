(function(){
const QZ = window.QZ = window.QZ || {};
QZ.bindControls=function(state,actions){
  const terrainButtons=[...document.querySelectorAll('[data-terrain]')];
  const modeBtn=document.querySelector('#modeBtn');
  const setActive=()=>terrainButtons.forEach(b=>b.classList.toggle('active',b.dataset.terrain===state.terrain));
  terrainButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const type=QZ.Terrain[btn.dataset.terrain];
    if(type){QZ.setTerrainType(state,type);QZ.log('选地形: '+type+' → '+QZ.Names[type]);}
    setActive();
  }));
  document.querySelector('#brushDown').addEventListener('click',()=>QZ.changeBrush(state,-1));
  document.querySelector('#brushUp').addEventListener('click',()=>QZ.changeBrush(state,1));
  document.querySelector('#clearBtn').addEventListener('click',actions.clear);
  document.querySelector('#randomBtn').addEventListener('click',actions.random);
  document.querySelector('#contourBtn').addEventListener('click',()=>{
    QZ.showContour=!QZ.showContour;QZ._contourLogNeeded=true;state.dirty=true;
    document.querySelector('#contourBtn').textContent='等高线：'+(QZ.showContour?'开':'关');
  });
  modeBtn.addEventListener('click',()=>{
    const mode=QZ.toggleMode(state);modeBtn.textContent=`模式：${mode==='brush'?'画笔':'查看'}`;
  });
  setActive();
};
})();
