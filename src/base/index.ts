import { Recordable } from './typings';

export function shallowCloning (origin: Recordable, target?: Recordable) {
  const tar = target || {}
  for (let key in origin) {
    // 剔除原型上的方法和属性
    if (origin.hasOwnProperty(key)) {
      tar[key] = origin[key]
    }
  }
  return tar
}

function isObject<T>(obj: T): boolean {
  return typeof obj === 'object' && obj !== null;
}

function isArray<T extends object> (obj: T) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

export function deepCloning (origin: Recordable, target?: Recordable) {
  const tar = target || {};

  for (let key in origin) {
    if (origin.hasOwnProperty(key)) {
      const value = origin[key]
      // 是否为对象
      if (isObject(value)) {
        tar[key] = isArray(value) ? [] : {}
        deepCloning(value, tar[key])
      } else {
        tar[key] = value
      }
    }
  }

  return tar
}