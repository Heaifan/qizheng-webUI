(function(){
const QZ = window.QZ = window.QZ || {};
QZ.Natural = Object.freeze({ none: 0, grass: 1, dirt: 2, high: 3 });
QZ.Water = Object.freeze({ none: 0, river: 1, lake: 2 });
QZ.Vegetation = Object.freeze({ none: 0, forest: 1, bush: 2 });
// 画笔：类型→(图层, 值) 映射
QZ.LayerInfo = {
  grass:  { layer: 'natural',   value: QZ.Natural.grass },
  high:   { layer: 'natural',   value: QZ.Natural.high },
  dirt:   { layer: 'natural',   value: QZ.Natural.dirt },
  water:  { layer: 'water',     value: QZ.Water.river },
  forest: { layer: 'vegetation',value: QZ.Vegetation.forest },
};
QZ.Terrain = Object.freeze({ grass: 'grass', water: 'water', forest: 'forest', high: 'high' });
QZ.Names = Object.freeze({ grass: '草地', water: '水面', forest: '树林', high: '高地' });
QZ.terrainName = function(type) { return QZ.Names[type] || type; };
})();
