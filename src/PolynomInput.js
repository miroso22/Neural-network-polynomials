'use strict';

const getPolynom = input => {
  const koefs = input.split(' ');
  for (let i = 0; i < koefs.length; i++) {
    koefs[i] = parseFloat(koefs[i]);
    if (isNaN(koefs[i])) {
      console.log('Invalid function input');
      return;
    }
  }

  const fn = x => {
    let res = 0;
    for (let i = 0; i < koefs.length; i++) {
      res += koefs[i] * Math.pow(x, koefs.length - 1 - i);
    }
    return res;
  }

  return fn;
}

module.exports = {
  getPolynom
};
