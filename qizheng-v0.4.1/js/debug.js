(function() {
const QZ = window.QZ = window.QZ || {};
const el = document.createElement('div');
el.id = 'debugLog';
Object.assign(el.style, {
  position: 'fixed', bottom: '4px', right: '4px', width: '280px', maxHeight: '140px',
  overflow: 'auto', background: 'rgba(30,30,30,.85)', color: '#cdd', fontSize: '11px',
  fontFamily: 'monospace', padding: '6px 8px', borderRadius: '6px', zIndex: '999',
  whiteSpace: 'pre-wrap', lineHeight: '1.5'
});
document.body.appendChild(el);
const logs = [];
QZ.log = function(msg) {
  const t = new Date().toLocaleTimeString();
  logs.unshift('[' + t + '] ' + msg);
  if (logs.length > 30) logs.pop();
  el.textContent = logs.join('\n');
  console.log('[探针] ' + msg);
};
QZ.clearLog = function() { logs.length = 0; el.textContent = ''; };
QZ.log('调试面板已启动 v0.4.2');
})();
