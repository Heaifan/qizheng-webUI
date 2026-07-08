window.QZ = window.QZ || {};

QZ.Terrains = [
  { id: 0, name: "草地", color: "#496b3a", move: 1.0, cover: 0 },
  { id: 1, name: "道路", color: "#9a8464", move: 1.4, cover: 0 },
  { id: 2, name: "树林", color: "#24523a", move: 0.7, cover: 30 },
  { id: 3, name: "水面", color: "#2b5f87", move: 0.2, cover: 0 },
  { id: 4, name: "房屋", color: "#7a4e3a", move: 0.0, cover: 70 },
  { id: 5, name: "高地", color: "#7a7040", move: 0.8, cover: 20 }
];

QZ.fuc_getTerrain = function (id) {
  return QZ.Terrains[id] || QZ.Terrains[0];
};
