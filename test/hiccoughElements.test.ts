import { test } from 'node:test'
import assert from 'node:assert/strict'

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
  type HiccoughAttributes,
  type HiccoughElement,
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
} from '../src/index.ts'
import { br, hr, img, span } from '../src/hiccoughElements.ts'

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
    assert.partialDeepStrictEqual(fn('x'), { name, content: ['x'] })
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
  for (const [fn, name] of voidElementfCases) assert.partialDeepStrictEqual(fn(), { name, voidElement: true })
})

test('title element', () => {
  assert.partialDeepStrictEqual(title('Hello'), { name: 'title', content: ['Hello'] })
})

test('link element', () => {
  assert.partialDeepStrictEqual(link('stylesheet', 'style.css'), {
    name: 'link',
    attributes: { rel: 'stylesheet', href: 'style.css' }
  })
})

test('a element', () => {
  assert.partialDeepStrictEqual(a('/path', 'click me'), {
    name: 'a',
    attributes: { href: '/path' },
    content: ['click me']
  })
})

test('mailTo element', () => {
  assert.partialDeepStrictEqual(mailTo('user@example.com'), {
    name: 'a',
    attributes: { href: 'mailto:user@example.com' },
    content: ['user@example.com']
  })
  assert.partialDeepStrictEqual(mailTo('user@example.com', 'Contact Us'), {
    name: 'a',
    attributes: { href: 'mailto:user@example.com' },
    content: ['Contact Us']
  })
})

test('unorderedList element', () => {
  assert.deepEqual(unorderedList(['a', 'b']), {
    isElement: true,
    name: 'ul',
    content: [
      { isElement: true, name: 'li', content: ['a'] },
      { isElement: true, name: 'li', content: ['b'] }
    ]
  })
})

test('orderedList element', () => {
  assert.deepEqual(orderedList(['a', 'b']), {
    isElement: true,
    name: 'ol',
    content: [
      { isElement: true, name: 'li', content: ['a'] },
      { isElement: true, name: 'li', content: ['b'] }
    ]
  })
})

test('includeJs', () => {
  assert.deepEqual(includeJs('app.js'), [
    { isElement: true, name: 'script', attributes: { type: 'text/javascript', src: 'app.js' }, content: [] }
  ])
  assert.equal(includeJs('app.js', 'vendor.js').length, 2)
})

test('includeCss', () => {
  assert.deepEqual(includeCss('style.css'), [
    {
      isElement: true,
      voidElement: true,
      name: 'link',
      attributes: { type: 'text/css', href: 'style.css', rel: 'stylesheet' }
    }
  ])
  assert.equal(includeCss('style.css', 'theme.css').length, 2)
})

test('nested table elements', () => {
  assert.deepEqual(table(tr(td('a'), td('b'))), {
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
