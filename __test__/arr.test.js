import { expect, test } from "vitest";
Array.prototype.myReduce = function (fn, init, context) {
  const len = this.length,
        _this = context || {};


  let result = init
  for (let i = 0; i < len; i++) {
    result = fn.apply(_this, [result, this[i], i, this])
  }

  return result;
}

test('reduce', () => {
  const arr = [2, 3, 4, 5]

  const sum = arr.myReduce((prev, elem) => {
    prev += elem
    return prev
  }, 0)

  expect(sum).toBe(14)
})