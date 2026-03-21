import { expect, test } from 'vitest'
import { html } from '../src/hiccoughCore.js'
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
} from '../src/hiccoughElements.js'
import { element, raw, withOptions } from '../src/hiccoughElement.js'
import { DOCTYPE_HTML5 } from '../src/hiccoughPage.js'

test('hiccough smoke test', () => {
  expect(
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
    )
  ).toEqual(`<!doctype html>
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
</html>`)
})

test('hiccough', () => {
  expect(html(element('span'))).toEqual(`<span></span>`)
  expect(html(element('span', 'bar'))).toEqual(`<span>bar</span>`)
  expect(html(element('span', 'bar', raw('&nbsp;baz')))).toEqual(`<span>bar&nbsp;baz</span>`)

  expect(html(element('span', { class: 'foo' }))).toEqual(`<span class="foo"></span>`)
  expect(html(element('span', { class: 'foo' }, 'bar'))).toEqual(`<span class="foo">bar</span>`)
  expect(html(element('span', { class: 'foo' }, '\nbar', '\nbaz'))).toEqual(`<span class="foo">
bar
baz</span>`)

  expect(html(tr(td('a')))).toEqual(`<tr><td>a</td></tr>`)
  expect(html(tr(td('a'), td('b')))).toEqual(`<tr><td>a</td><td>b</td></tr>`)
  expect(html(table(tr(td('a'), td('b'))))).toEqual(`<table><tr><td>a</td><td>b</td></tr></table>`)
  expect(html(table({ class: 'table' }, tr(...['a', 'b', 'c'].map((x) => td(x)))))).toEqual(
    `<table class="table"><tr><td>a</td><td>b</td><td>c</td></tr></table>`
  )

  expect(html(div(p('Hello'), p('World')))).toEqual(`<div><p>Hello</p><p>World</p></div>`)
  expect(html(div(...[p('Hello'), p('World')]))).toEqual(`<div><p>Hello</p><p>World</p></div>`)
  expect(html(p(undefined, 'Hello', undefined, 'World'))).toEqual(`<p>HelloWorld</p>`)

  expect(html([p('Hello'), p('World')])).toEqual(`<p>Hello</p><p>World</p>`)
  expect(html([p('Hello'), p('World')])).toEqual(`<p>Hello</p><p>World</p>`)
})

test('escaping', () => {
  expect(html(element('p', '<b>bold</b>'))).toEqual(`<p>&lt;b&gt;bold&lt;/b&gt;</p>`)
  expect(html(element('p', 'a & b'))).toEqual(`<p>a &amp; b</p>`)
  expect(html(element('p', raw('<b>bold</b>')))).toEqual(`<p><b>bold</b></p>`)
  expect(html(element('p', "it's here"))).toEqual(`<p>it&apos;s here</p>`)
  expect(html(element('a', { href: '/path?a=1&b=2' }, 'link'))).toEqual(`<a href="/path?a=1&amp;b=2">link</a>`)
  expect(html(element('p', { 'data-val': '<script>' }, 'text'))).toEqual(`<p data-val="&lt;script&gt;">text</p>`)
  expect(html(element('p', { class: 'a"b' }, 'text'))).toEqual(`<p class="a&quot;b">text</p>`)
  expect(html(element('p', { class: "a'b" }, 'text'))).toEqual(`<p class="a&apos;b">text</p>`)
})

test('void element rendering', () => {
  expect(html(br())).toEqual(`<br>`)
  expect(html(hr())).toEqual('<hr>')
  expect(html(img({ src: 'photo.jpg', alt: 'photo' }))).toEqual(`<img src="photo.jpg" alt="photo">`)
  expect(html(input({ type: 'text', name: 'q' }))).toEqual(`<input type="text" name="q">`)
  expect(html(meta({ charset: 'utf-8' }))).toEqual(`<meta charset="utf-8">`)
  expect(html(link('stylesheet', 'style.css'))).toEqual(`<link rel="stylesheet" href="style.css">`)
  expect(html(div(p('Hello'), br(), p('World')), { newLines: true })).toEqual(`<div>
  <p>Hello</p>
  <br>
  <p>World</p>
</div>`)
})

test('hiccough with options', () => {
  const indentAndNewLine = {
    eachIndent: '  ',
    newLines: true
  }

  expect(html(element('span', { class: 'foo' }, 'bar'), indentAndNewLine)).toEqual(`<span class="foo">bar</span>`)

  expect(html(div({ class: 'foo' }, p('Hello'), p('World')), indentAndNewLine)).toEqual(`<div class="foo">
  <p>Hello</p>
  <p>World</p>
</div>`)

  expect(html(p('Hello', 'World', 'Again'), indentAndNewLine)).toEqual(`<p>
Hello
World
Again
</p>`)

  expect(html(table(tr(td('a'), td('b'))), indentAndNewLine)).toEqual(`<table>
  <tr>
    <td>a</td>
    <td>b</td>
  </tr>
</table>`)

  expect(html(table(tr(undefined, td('a'), undefined, td('b'), undefined)), indentAndNewLine)).toEqual(`<table>
  <tr>
    <td>a</td>
    <td>b</td>
  </tr>
</table>`)

  expect(
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
    )
  ).toEqual(`<table>
  <tr><td>a</td><td>b</td></tr>
</table>`)

  expect(html(div(p('Hello', 'World', a('https://example.com', 'example')), p('Hello'), p('World')), indentAndNewLine))
    .toEqual(`<div>
  <p>
Hello
World
    <a href="https://example.com">example</a>
  </p>
  <p>Hello</p>
  <p>World</p>
</div>`)

  expect(
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
    )
  ).toEqual(`<div>
  <p>HelloWorld<a href="https://example.com">example</a></p>
  <p>Hello</p>
  <p>World</p>
</div>`)
})

test('mailTo', () => {
  expect(html(mailTo('user@example.com'))).toEqual(`<a href="mailto:user@example.com">user@example.com</a>`)
  expect(html(mailTo('user@example.com', 'Contact Us'))).toEqual(`<a href="mailto:user@example.com">Contact Us</a>`)
})

test('unorderedList and orderedList', () => {
  expect(html(unorderedList(['Apple', 'Banana', 'Cherry']), { newLines: true })).toEqual(`<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ul>`)
  expect(html(orderedList(['First', 'Second', 'Third']), { newLines: true })).toEqual(`<ol>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>`)
  expect(html(unorderedList([a('/one', 'One'), a('/two', 'Two')]), { newLines: true })).toEqual(`<ul>
  <li>
    <a href="/one">One</a>
  </li>
  <li>
    <a href="/two">Two</a>
  </li>
</ul>`)
})

test('includeJs and includeCss', () => {
  expect(html(includeJs('app.js'), { newLines: true })).toEqual(`<script type="text/javascript" src="app.js"></script>`)
  expect(html(includeJs('app.js', 'vendor.js'), { newLines: true })).toEqual(
    `<script type="text/javascript" src="app.js"></script>\n<script type="text/javascript" src="vendor.js"></script>`
  )
  expect(html(includeCss('style.css'), { newLines: true })).toEqual(
    `<link type="text/css" href="style.css" rel="stylesheet">`
  )
  expect(html(includeCss('style.css', 'theme.css'), { newLines: true })).toEqual(
    `<link type="text/css" href="style.css" rel="stylesheet">\n<link type="text/css" href="theme.css" rel="stylesheet">`
  )
})
