import { test } from 'node:test'
import assert from 'node:assert/strict'
import { element, isRawHtml, raw, voidElement, withAttributes, withOptions } from '../src/hiccoughElement.ts'
import { p } from '../src/hiccoughElements.ts'

void test('raw', () => {
  assert.deepEqual(raw('<b>bold</b>'), { _raw: '<b>bold</b>' })
  assert.deepEqual(raw(''), { _raw: '' })
})

void test('isRawHtml', () => {
  assert.equal(isRawHtml(raw('<b>bold</b>')), true)
  assert.equal(isRawHtml({ _raw: 'hello' }), true)
  assert.equal(isRawHtml('hello'), false)
  assert.equal(isRawHtml(null), false)
  assert.equal(isRawHtml(undefined), false)
  assert.equal(isRawHtml({ _raw: 42 }), false)
  assert.equal(isRawHtml(element('p')), false)
})

void test('raw as element content', () => {
  assert.deepEqual(element('p', raw('<b>bold</b>')), {
    isElement: true,
    name: 'p',
    content: [{ _raw: '<b>bold</b>' }]
  })
  assert.deepEqual(element('p', 'text', raw('<br>'), 'more'), {
    isElement: true,
    name: 'p',
    content: ['text', { _raw: '<br>' }, 'more']
  })
})

void test('element', () => {
  assert.deepEqual(element('p'), {
    isElement: true,
    name: 'p',
    content: []
  })
  assert.deepEqual(element('p', 'hello'), {
    isElement: true,
    name: 'p',
    content: ['hello']
  })
  assert.deepEqual(element('p', 'hello', 'world'), {
    isElement: true,
    name: 'p',
    content: ['hello', 'world']
  })
})

void test('voidElement', () => {
  assert.deepEqual(voidElement('br'), { isElement: true, voidElement: true, name: 'br' })
  assert.deepEqual(voidElement('img', { src: 'photo.jpg', alt: 'photo' }), {
    isElement: true,
    voidElement: true,
    name: 'img',
    attributes: { src: 'photo.jpg', alt: 'photo' }
  })
})

void test('element with nesting', () => {
  assert.deepEqual(element('div', element('p', 'hello')), {
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
  assert.deepEqual(element('div', element('p', 'hello'), element('p', 'world')), {
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
  assert.deepEqual(element('div', element('p', 'hello'), 'new', element('p', 'world')), {
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

void test('elementWithAttributes', () => {
  assert.deepEqual(element('p', { id: 'myTag' }), {
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: []
  })
  assert.deepEqual(element('p', { id: 'myTag' }, 'hello'), {
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: ['hello']
  })
  assert.deepEqual(element('p', { id: 'myTag' }, 'hello', 'world'), {
    isElement: true,
    name: 'p',
    attributes: { id: 'myTag' },
    content: ['hello', 'world']
  })
  assert.deepEqual(element('p', { id: 'myTag' }, 'hello', element('p', 'world')), {
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

void test('with attributes', () => {
  assert.deepEqual(withAttributes({ class: 'myClass', id: 'pOne' }, p('Hello World')), {
    isElement: true,
    name: 'p',
    attributes: {
      id: 'pOne',
      class: 'myClass'
    },
    content: ['Hello World']
  })
})

void test('with options', () => {
  assert.deepEqual(withOptions({ newLines: true }, element('p')), {
    isElement: true,
    name: 'p',
    content: [],
    options: {
      newLines: true
    }
  })
})
