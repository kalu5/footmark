Array.prototype.myReduce = function (fn, init, context) {
  const len = this.length,
        _this = context || window;

  let result = init
  for (let i = 0; i < len; i++) {
    result = fn.apply(_this, [result, this[i], i, this])
  }

  return result;
}


Array.prototype.myReduceRight = function (fn, init, context) {
  const len = this.length,
        _this = context || window;

  let result = init
  for (let i = len -1 ; i >= 0 ; i--) {
    result = fn.apply(_this, [result, this[i], i, this])
  }

  return result;
}