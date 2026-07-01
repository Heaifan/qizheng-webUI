(function(){
const QZ = window.QZ;
let _seed = Date.now();
QZ.setSeed = function(s) { _seed = s | 0; QZ.lastSeed = _seed; };
QZ.getSeed = function() { return _seed; };
QZ.random = function() {
  _seed = (_seed * 1664525 + 1013904223) | 0;
  return (_seed >>> 0) / 4294967296;
};
QZ.randomInt = function(a, b) {
  return Math.floor(QZ.random() * (b - a + 1)) + a;
};
QZ.lastSeed = _seed;
})();
