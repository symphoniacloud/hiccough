import { expect, test } from 'vitest'
import {
  a,
  b,
  body,
  br,
  button,
  div,
  form,
  head,
  h1,
  h2,
  h3,
  h4,
  hr,
  htmlPage,
  i,
  img,
  input,
  label,
  link,
  meta,
  p,
  script,
  span,
  table,
  tbody,
  td,
  th,
  thead,
  title,
  tr
} from '../src/hiccoughElements.js'
import { type HiccoughAttributes, type HiccoughElement } from '../src/hiccoughElement.js'

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

const voidElementfCases: [(attributes?: HiccoughAttributes) => HiccoughElement, string][] = [
  [br, 'br'],
  [hr, 'hr'],
  [img, 'img'],
  [input, 'input'],
  [meta, 'meta']
]

test('elementf elements', () => {
  for (const [fn, name] of elementfCases) expect(fn('x')).toMatchObject({ name, content: ['x'] })
})

test('voidElementf elements', () => {
  for (const [fn, name] of voidElementfCases) expect(fn()).toMatchObject({ name, voidElement: true })
})

test('title element', () => {
  expect(title('Hello')).toMatchObject({ name: 'title', content: ['Hello'] })
})

test('link element', () => {
  expect(link('stylesheet', 'style.css')).toMatchObject({
    name: 'link',
    voidElement: true,
    attributes: { rel: 'stylesheet', href: 'style.css' }
  })
})

test('a element', () => {
  expect(a('/path', 'click me')).toMatchObject({ name: 'a', attributes: { href: '/path' }, content: ['click me'] })
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
