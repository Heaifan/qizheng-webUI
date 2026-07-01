(function(){
const QZ = window.QZ = window.QZ || {};
QZ.Natural = Object.freeze({ none: 0, grass: 1, dirt: 2, high: 3 });
QZ.Water = Object.freeze({ none: 0, river: 1, lake: 2 });
QZ.Vegetation = Object.freeze({ none: 0, forest: 1, bush: 2 });
QZ.Surface = Object.freeze({ none: 0, concrete: 1, yard: 2 });
QZ.Road = Object.freeze({ none: 0, path: 1, road: 2, bridge: 3 });
QZ.Building = Object.freeze({ none: 0, house: 1, warehouse: 2 });
QZ.LayerInfo = {
  grass:    { layer: 'natural',   value: QZ.Natural.grass },
  high:     { layer: 'natural',   value: QZ.Natural.high },
  dirt:     { layer: 'natural',   value: QZ.Natural.dirt },
  water:    { layer: 'water',     value: QZ.Water.river },
  forest:   { layer: 'vegetation',value: QZ.Vegetation.forest },
  concrete: { layer: 'surface',   value: QZ.Surface.concrete },
  road:     { layer: 'road',      value: QZ.Road.road },
  house:    { layer: 'building',  value: QZ.Building.house },
};
QZ.Terrain = Object.freeze({ grass: 'grass', road: 'road', forest: 'forest', water: 'water', house: 'house', high: 'high', concrete: 'concrete' });
QZ.Names = Object.freeze({ grass: '草地', road: '道路', forest: '树林', water: '水面', house: '房屋', high: '高地', concrete: '水泥地' });
QZ.terrainName = function(type) { return QZ.Names[type] || type; };
})();
