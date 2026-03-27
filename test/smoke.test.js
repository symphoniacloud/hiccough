import { expect, test } from 'vitest'
import {
  html,
  DOCTYPE_HTML5,
  htmlPage,
  head,
  title,
  body,
  div,
  h1,
  p,
  span,
  a,
  hr,
  table,
  tr,
  td,
  raw
} from '../src/index.js'

test('javascript smoke test', () => {
  expect(
    html(
      [
        DOCTYPE_HTML5,
        htmlPage(
          { lang: 'en' },
          head(title('Hiccough JS Test')),
          body(
            div(
              { id: 'top' },
              h1('Hello from JS'),
              p('Welcome'),
              p(span('<script>alert("xss")</script>')),
              p(raw('<b>bold</b>')),
              a('/search?q=hello&lang=en', 'Search'),
              hr(),
              table(tr(...['a', 'b', 'c'].map((x) => td(x))))
            )
          )
        )
      ],
      { newLines: true, eachIndent: '  ' }
    )
  ).toEqual(`<!doctype html>
<html lang="en">
  <head>
    <title>Hiccough JS Test</title>
  </head>
  <body>
    <div id="top">
      <h1>Hello from JS</h1>
      <p>Welcome</p>
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
