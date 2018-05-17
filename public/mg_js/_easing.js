var easing_types = {
  linear: function (t) {
    return t;
  },
  sine: function (rate) {
    return Math.sin(rate * Math.PI/2);
  },
  easeInQuad: function (t) {
    return Math.pow(t, 2);
  },
  easeOutQuad: function (t) {
    return t*(2-t);
  },
  easeInOutQuad: function (t) {
    return t<0.5 ? 2*Math.pow(t, 2) : -1+(4-2*t)*t;
  },
  easeInCubic: function (t) {
    return Math.pow(t, 3);
  },
  easeOutCubic: function (t) {
    return (--t)*Math.pow(t, 2)+1;
  },
  easeInOutCubic: function (t) {
    return t<0.5 ? 4*Math.pow(t, 3) : (t-1)*(2*t-2)*(2*t-2)+1;
  },
  easeInQuart: function (t) {
    return Math.pow(t, 4);
  },
  easeOutQuart: function (t) {
    return 1-(--t)*Math.pow(t, 3);
  },
  easeInOutQuart: function (t) {
    return t<0.5 ? 8*Math.pow(t, 4) : 1-8*(--t)*Math.pow(t, 3);
  },
  easeInQuint: function (t) {
    return Math.pow(t, 5);
  },
  easeOutQuint: function (t) {
    return 1+(--t)*Math.pow(t, 4);
  },
  easeInOutQuint: function (t) {
    return t<0.5 ? 16*Math.pow(t, 5) : 1+16*(--t)*Math.pow(t, 4);
  }
};