import { expect, test } from 'vitest'
import { element, isRawHtml, raw, voidElement, withAttributes, withOptions } from '../src/hiccoughElement.js'
import { p } from '../src/hiccoughElements.js'

test('raw', () => {
  expect(raw('<b>bold</b>')).toEqual({ _raw: '<b>bold</b>' })
  expect(raw('')).toEqual({ _raw: '' })
})

test('isRawHtml', () => {
  expect(isRawHtml(raw('<b>bold</b>'))).toBe(true)
  expect(isRawHtml({ _raw: 'hello' })).toBe(true)
  expect(isRawHtml('hello')).toBe(false)
  expect(isRawHtml(null)).toBe(false)
  expect(isRawHtml(undefined)).toBe(false)
  expect(isRawHtml({ _raw: 42 })).toBe(false)
  expect(isRawHtml(element('p'))).toBe(false)
})

test('raw as element content', () => {
  expect(element('p', raw('<b>bold</b>'))).toEqual({
    isElement: true,
    name: 'p',
    content: [{ _raw: '<b>bold</b>' }]
  })
  expect(element('p', 'text', raw('<br>'), 'more')).toEqual({
    isElement: true,
    name: 'p',
    content: ['text', { _raw: '<br>' }, 'more']
  })
})

test('element', () => {
  expect(element('p')).toEqual({
    isElement: true,
    name: 'p',
    content: []
  })
  expect(element('p', 'hello')).toEqual({
    isElement: true,
    name: 'p',
    content: ['hello']
  })
  expect(element('p', 'hello', 'world')).toEqual({
    isElement: true,
    name: 'p',
    content: ['hello', 'world']
  })
})

test('voidElement', () => {
  expect(voidElement('br')).toEqual({ isElement: true, voidElement: true, name: 'br' })
  expect(voidElement('img', { src: 'photo.jpg', alt: 'photo' })).toEqual({
    isElement: true,
    voidElement: true,
    name: 'img',
    attributes: { src: 'photo.jpg', alt: 'photo' }
  })
})

test('element with nesting', () => {
  expect(element('div', element('p', 'hello'))).toEqual({
    isElement: true,
    name: 'div',
    content: [
      {
        content: ['hello'],
        isElement: true,
        name: 'p'
      }
    ]
  })
  expect(element('div', element('p', 'hello'), element('p', 'world'))).toEqual({
    isElement: true,
    name: 'div',
    content: [
      {
        content: ['hello'],
        isElement: true,
        name: 'p'
      },
      {
        content: ['world'],
        isElement: true,
        name: 'p'
      }
    ]
  })
  expect(element('div', element('p', 'hello'), 'new', element('p', 'world'))).toEqual({
    isElement: true,
    name: 'div',
    content: [
      {
        content: ['hello'],
        isElement: true,
        name: 'p'
      },
      'new',
      {
        content: ['world'],
        isElement: true,
        name: 'p'
      }
    ]
  })
})

test('elementWithAttributes', () => {
  expect(element('p', { id: 'myTag' })).toEqual({
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: []
  })
  expect(element('p', { id: 'myTag' }, 'hello')).toEqual({
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: ['hello']
  })
  expect(element('p', { id: 'myTag' }, 'hello', 'world')).toEqual({
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: ['hello', 'world']
  })
  expect(element('p', { id: 'myTag' }, 'hello', element('p', 'world'))).toEqual({
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: [
      'hello',
      {
        content: ['world'],
        isElement: true,
        name: 'p'
      }
    ]
  })
})

test('with attributes', () => {
  expect(withAttributes({ class: 'myClass', id: 'pOne' }, p('Hello World'))).toEqual({
    isElement: true,
    name: 'p',
    attributes: {
      id: 'pOne',
      class: 'myClass'
    },
    content: ['Hello World']
  })
})

test('with options', () => {
  expect(withOptions({ newLines: true }, element('p'))).toEqual({
    isElement: true,
    name: 'p',
    content: [],
    options: {
      newLines: true
    }
  })
})
