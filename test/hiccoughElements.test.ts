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
  HiccoughElement,
  htmlPage,
  i,
  input,
  label,
  link,
  meta,
  p,
  script,
  table,
  tbody,
  td,
  th,
  thead,
  title,
  tr
} from '../src/index.js'
import { span } from '../src/hiccoughElements.js'

const elementfCases: [(...def: string[]) => HiccoughElement, string][] = [
  [htmlPage, 'html'],
  [head, 'head'],
  [meta, 'meta'],
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
  [input, 'input'],
  [label, 'label'],
  [button, 'button']
]

test('elementf elements', () => {
  for (const [fn, name] of elementfCases) {
    expect(fn('x')).toMatchObject({ name, content: ['x'] })
  }
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
