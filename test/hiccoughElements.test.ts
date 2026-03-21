import { expect, test } from 'vitest'

import {
  a,
  b,
  body,
  button,
  div,
  form,
  h1,
  h2,
  h3,
  h4,
  head,
  HiccoughAttributes,
  HiccoughElement,
  htmlPage,
  i,
  includeCss,
  includeJs,
  input,
  label,
  link,
  mailTo,
  meta,
  orderedList,
  p,
  script,
  table,
  tbody,
  td,
  th,
  thead,
  title,
  tr,
  unorderedList
} from '../src/index.js'
import { br, hr, img, span } from '../src/hiccoughElements.js'

const elementfCases: [(...def: string[]) => HiccoughElement, string][] = [
  [htmlPage, 'html'],
  [head, 'head'],
  [script, 'script'],
  [body, 'body'],
  [h1, 'h1'],
  [h2, 'h2'],
  [h3, 'h3'],
  [h4, 'h4'],
  [table, 'table'],
  [thead, 'thead'],
  [tbody, 'tbody'],
  [tr, 'tr'],
  [th, 'th'],
  [td, 'td'],
  [p, 'p'],
  [i, 'i'],
  [b, 'b'],
  [span, 'span'],
  [div, 'div'],
  [form, 'form'],
  [label, 'label'],
  [button, 'button']
]

test('elementf elements', () => {
  for (const [fn, name] of elementfCases) {
    expect(fn('x')).toMatchObject({ name, content: ['x'] })
  }
})

const voidElementfCases: [(attributes?: HiccoughAttributes) => HiccoughElement, string][] = [
  [br, 'br'],
  [hr, 'hr'],
  [img, 'img'],
  [input, 'input'],
  [meta, 'meta']
]

test('voidElementf elements', () => {
  for (const [fn, name] of voidElementfCases) expect(fn()).toMatchObject({ name, voidElement: true })
})

test('title element', () => {
  expect(title('Hello')).toMatchObject({ name: 'title', content: ['Hello'] })
})

test('link element', () => {
  expect(link('stylesheet', 'style.css')).toMatchObject({
    name: 'link',
    attributes: { rel: 'stylesheet', href: 'style.css' }
  })
})

test('a element', () => {
  expect(a('/path', 'click me')).toMatchObject({ name: 'a', attributes: { href: '/path' }, content: ['click me'] })
})

test('mailTo element', () => {
  expect(mailTo('user@example.com')).toMatchObject({
    name: 'a',
    attributes: { href: 'mailto:user@example.com' },
    content: ['user@example.com']
  })
  expect(mailTo('user@example.com', 'Contact Us')).toMatchObject({
    name: 'a',
    attributes: { href: 'mailto:user@example.com' },
    content: ['Contact Us']
  })
})

test('unorderedList element', () => {
  expect(unorderedList(['a', 'b'])).toEqual({
    isElement: true,
    name: 'ul',
    content: [
      { isElement: true, name: 'li', content: ['a'] },
      { isElement: true, name: 'li', content: ['b'] }
    ]
  })
})

test('orderedList element', () => {
  expect(orderedList(['a', 'b'])).toEqual({
    isElement: true,
    name: 'ol',
    content: [
      { isElement: true, name: 'li', content: ['a'] },
      { isElement: true, name: 'li', content: ['b'] }
    ]
  })
})

test('includeJs', () => {
  expect(includeJs('app.js')).toEqual([
    { isElement: true, name: 'script', attributes: { type: 'text/javascript', src: 'app.js' }, content: [] }
  ])
  expect(includeJs('app.js', 'vendor.js')).toHaveLength(2)
})

test('includeCss', () => {
  expect(includeCss('style.css')).toEqual([
    {
      isElement: true,
      voidElement: true,
      name: 'link',
      attributes: { type: 'text/css', href: 'style.css', rel: 'stylesheet' }
    }
  ])
  expect(includeCss('style.css', 'theme.css')).toHaveLength(2)
})

test('nested table elements', () => {
  expect(table(tr(td('a'), td('b')))).toEqual({
    isElement: true,
    name: 'table',
    content: [
      {
        isElement: true,
        name: 'tr',
        content: [
          { isElement: true, name: 'td', content: ['a'] },
          { isElement: true, name: 'td', content: ['b'] }
        ]
      }
    ]
  })
})
