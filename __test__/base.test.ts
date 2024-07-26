import { expect, test } from 'vitest'
import { shallowCloning, deepCloning } from '../src/base/index'

test('shallowCloning', () => {
  const foo = {
    name: 'foo'
  }

  const bar = shallowCloning(foo)

  bar.name = 'bar'

  expect(foo.name).toBe('foo')
  expect(bar.name).toBe('bar')
})

test('deepCloning', () => {
  const foo = {
    name: 'foo',
    child: {
      name: 'fooChild',
      child: {
        name: 'fooChildChild'
      }
    },
    cars: ['Model3']
  }

  const bar = deepCloning(foo)

  bar.name = 'bar'

  expect(foo.name).toBe('foo')
  expect(bar.name).toBe('bar')

  bar.child.name = 'barChild'

  expect(foo.child.name).toBe('fooChild')
  expect(bar.child.name).toBe('barChild')

  bar.cars.push('Su7')

  expect(foo.cars).toEqual(['Model3'])
  expect(bar.cars).toEqual(['Model3', 'Su7'])

  bar.child.child.name = 'barChildChild'


  expect(foo.child.child.name).toBe('fooChildChild')
  expect(bar.child.child.name).toBe('barChildChild')
})