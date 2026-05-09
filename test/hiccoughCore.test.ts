import { test } from 'node:test'
import assert from 'node:assert/strict'
import { html } from '../src/hiccoughCore.ts'
import {
  a,
  body,
  br,
  div,
  h1,
  head,
  hr,
  htmlPage,
  img,
  includeCss,
  includeJs,
  input,
  link,
  mailTo,
  meta,
  orderedList,
  p,
  span,
  table,
  td,
  title,
  tr,
  unorderedList
} from '../src/hiccoughElements.ts'
import { element, raw, withOptions } from '../src/hiccoughElement.ts'
import { DOCTYPE_HTML5 } from '../src/hiccoughPage.ts'

test('hiccough smoke test', () => {
  assert.equal(
    html(
      [
        DOCTYPE_HTML5,
        htmlPage(
          { lang: 'en' },
          head(title('Hiccough Test')),
          body(
            div(
              { id: 'top' },
              h1('Hello'),
              p('Welcome To Hiccouugh'),
              p(span('<script>alert("xss")</script>')),
              p(raw('<b>bold</b>')),
              a('/search?q=hello&lang=en', 'Search'),
              hr(),
              table(tr(...['a', 'b', 'c'].map((x) => td(x))))
            )
          )
        )
      ],
      {
        newLines: true,
        eachIndent: '  '
      }
    ),
    `<!doctype html>
<html lang="en">
  <head>
    <title>Hiccough Test</title>
  </head>
  <body>
    <div id="top">
      <h1>Hello</h1>
      <p>Welcome To Hiccouugh</p>
      <p>
        <span>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</span>
      </p>
      <p><b>bold</b></p>
      <a href="/search?q=hello&amp;lang=en">Search</a>
      <hr>
      <table>
        <tr>
          <td>a</td>
          <td>b</td>
          <td>c</td>
        </tr>
      </table>
    </div>
  </body>
</html>`
  )
})

test('hiccough', () => {
  assert.equal(html(element('span')), `<span></span>`)
  assert.equal(html(element('span', 'bar')), `<span>bar</span>`)
  assert.equal(html(element('span', 'bar', raw('&nbsp;baz'))), `<span>bar&nbsp;baz</span>`)

  assert.equal(html(element('span', { class: 'foo' })), `<span class="foo"></span>`)
  assert.equal(html(element('span', { class: 'foo' }, 'bar')), `<span class="foo">bar</span>`)
  assert.equal(
    html(element('span', { class: 'foo' }, '\nbar', '\nbaz')),
    `<span class="foo">
bar
baz</span>`
  )

  assert.equal(html(tr(td('a'))), `<tr><td>a</td></tr>`)
  assert.equal(html(tr(td('a'), td('b'))), `<tr><td>a</td><td>b</td></tr>`)
  assert.equal(html(table(tr(td('a'), td('b')))), `<table><tr><td>a</td><td>b</td></tr></table>`)
  assert.equal(
    html(table({ class: 'table' }, tr(...['a', 'b', 'c'].map((x) => td(x))))),
    `<table class="table"><tr><td>a</td><td>b</td><td>c</td></tr></table>`
  )

  assert.equal(html(div(p('Hello'), p('World'))), `<div><p>Hello</p><p>World</p></div>`)
  assert.equal(html(div(...[p('Hello'), p('World')])), `<div><p>Hello</p><p>World</p></div>`)
  assert.equal(html(p(undefined, 'Hello', undefined, 'World')), `<p>HelloWorld</p>`)

  assert.equal(html([p('Hello'), p('World')]), `<p>Hello</p><p>World</p>`)
  assert.equal(html([p('Hello'), p('World')]), `<p>Hello</p><p>World</p>`)
})

test('escaping', () => {
  assert.equal(html(element('p', '<b>bold</b>')), `<p>&lt;b&gt;bold&lt;/b&gt;</p>`)
  assert.equal(html(element('p', 'a & b')), `<p>a &amp; b</p>`)
  assert.equal(html(element('p', raw('<b>bold</b>'))), `<p><b>bold</b></p>`)
  assert.equal(html(element('p', "it's here")), `<p>it&apos;s here</p>`)
  assert.equal(html(element('a', { href: '/path?a=1&b=2' }, 'link')), `<a href="/path?a=1&amp;b=2">link</a>`)
  assert.equal(html(element('p', { 'data-val': '<script>' }, 'text')), `<p data-val="&lt;script&gt;">text</p>`)
  assert.equal(html(element('p', { class: 'a"b' }, 'text')), `<p class="a&quot;b">text</p>`)
  assert.equal(html(element('p', { class: "a'b" }, 'text')), `<p class="a&apos;b">text</p>`)
})

test('void element rendering', () => {
  assert.equal(html(br()), `<br>`)
  assert.equal(html(hr()), '<hr>')
  assert.equal(html(img({ src: 'photo.jpg', alt: 'photo' })), `<img src="photo.jpg" alt="photo">`)
  assert.equal(html(input({ type: 'text', name: 'q' })), `<input type="text" name="q">`)
  assert.equal(html(meta({ charset: 'utf-8' })), `<meta charset="utf-8">`)
  assert.equal(html(link('stylesheet', 'style.css')), `<link rel="stylesheet" href="style.css">`)
  assert.equal(
    html(div(p('Hello'), br(), p('World')), { newLines: true }),
    `<div>
  <p>Hello</p>
  <br>
  <p>World</p>
</div>`
  )
})

test('hiccough with options', () => {
  const indentAndNewLine = {
    eachIndent: '  ',
    newLines: true
  }

  assert.equal(html(element('span', { class: 'foo' }, 'bar'), indentAndNewLine), `<span class="foo">bar</span>`)

  assert.equal(
    html(div({ class: 'foo' }, p('Hello'), p('World')), indentAndNewLine),
    `<div class="foo">
  <p>Hello</p>
  <p>World</p>
</div>`
  )

  assert.equal(
    html(p('Hello', 'World', 'Again'), indentAndNewLine),
    `<p>
Hello
World
Again
</p>`
  )

  assert.equal(
    html(table(tr(td('a'), td('b'))), indentAndNewLine),
    `<table>
  <tr>
    <td>a</td>
    <td>b</td>
  </tr>
</table>`
  )

  assert.equal(
    html(table(tr(undefined, td('a'), undefined, td('b'), undefined)), indentAndNewLine),
    `<table>
  <tr>
    <td>a</td>
    <td>b</td>
  </tr>
</table>`
  )

  assert.equal(
    html(
      table(
        withOptions(
          {
            newLines: false,
            indentFromParent: true
          },
          tr(td('a'), td('b'))
        )
      ),
      indentAndNewLine
    ),
    `<table>
  <tr><td>a</td><td>b</td></tr>
</table>`
  )

  assert.equal(
    html(div(p('Hello', 'World', a('https://example.com', 'example')), p('Hello'), p('World')), indentAndNewLine),
    `<div>
  <p>
Hello
World
    <a href="https://example.com">example</a>
  </p>
  <p>Hello</p>
  <p>World</p>
</div>`
  )

  assert.equal(
    html(
      div(
        withOptions(
          {
            newLines: false,
            indentFromParent: true
          },
          p('Hello', 'World', a('https://example.com', 'example'))
        ),
        p('Hello'),
        p('World')
      ),
      indentAndNewLine
    ),
    `<div>
  <p>HelloWorld<a href="https://example.com">example</a></p>
  <p>Hello</p>
  <p>World</p>
</div>`
  )
})

test('mailTo', () => {
  assert.equal(html(mailTo('user@example.com')), `<a href="mailto:user@example.com">user@example.com</a>`)
  assert.equal(html(mailTo('user@example.com', 'Contact Us')), `<a href="mailto:user@example.com">Contact Us</a>`)
})

test('unorderedList and orderedList', () => {
  assert.equal(
    html(unorderedList(['Apple', 'Banana', 'Cherry']), { newLines: true }),
    `<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>`
  )
  assert.equal(
    html(orderedList(['First', 'Second', 'Third']), { newLines: true }),
    `<ol>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>`
  )
  assert.equal(
    html(unorderedList([a('/one', 'One'), a('/two', 'Two')]), { newLines: true }),
    `<ul>
  <li>
    <a href="/one">One</a>
  </li>
  <li>
    <a href="/two">Two</a>
  </li>
</ul>`
  )
})

test('includeJs and includeCss', () => {
  assert.equal(html(includeJs('app.js'), { newLines: true }), `<script type="text/javascript" src="app.js"></script>`)
  assert.equal(
    html(includeJs('app.js', 'vendor.js'), { newLines: true }),
    `<script type="text/javascript" src="app.js"></script>\n<script type="text/javascript" src="vendor.js"></script>`
  )
  assert.equal(
    html(includeCss('style.css'), { newLines: true }),
    `<link type="text/css" href="style.css" rel="stylesheet">`
  )
  assert.equal(
    html(includeCss('style.css', 'theme.css'), { newLines: true }),
    `<link type="text/css" href="style.css" rel="stylesheet">\n<link type="text/css" href="theme.css" rel="stylesheet">`
  )
})
