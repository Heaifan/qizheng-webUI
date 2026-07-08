window.QZ = window.QZ || {};

QZ.fuc_getLayoutName = function () {
  if (window.innerWidth >= 900 && window.innerWidth >= window.innerHeight) return "横屏";
  if (window.innerWidth >= 720) return "平板";
  return "竖屏";
};
