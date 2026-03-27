# Hiccough

A HTML generation library / "internal DSL" for JavaScript and TypeScript. Generate HTML using composable functions instead of external templates. Works in Node and the browser.

Inspired by using [hiccup](https://github.com/weavejester/hiccup) many years ago.

## Installation

```bash
npm install @symphoniacloud/hiccough
```

Hiccough supports ESM / ES Modules only, **not** CJS / CommonJS

## Usage

A test is worth a thousand words...

```typescript
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
```

## Features

- Composable element functions, allowing for loops, conditionals, etc.
- Support for attributes and nested content
- HTML-escaped by default, with a `raw()` escape hatch for trusted content
- Optional formatting with indentation and newlines
- No runtime dependencies
- When using TypeScript it provides type-checked HTML generation in standard TS file
- Works in Node and browser

## Breaking change between Hiccough 0.1 and 0.2 / 1.0

Hiccough 0.1 doesn't escape strings by default, while 0.2 does.

In Hiccough 0.1, strings are passed through as-is, so you could write HTML entities or inline HTML directly:

```typescript
html(p('Hello &amp; welcome'))
html(div('&nbsp;'))
```

In Hiccough 0.2, strings are escaped automatically, so those same calls would produce escaped output. To pass through raw HTML or entities, use the `raw()` function:

```typescript
html(p('Hello & welcome'))       // & is escaped to &amp; automatically
html(div(raw('&nbsp;')))         // raw() bypasses escaping
html(p(raw('<b>bold</b>')))      // raw() for inline HTML
```

## Background

I developed this code while writing [Cicada](https://github.com/symphoniacloud/cicada). Cicada generates HTML on the server side
both for pages, and fragments returned by HTMX-related calls. I didn't want to use an external templating library, but
I wanted something more structured than just verbatim strings.

I remembered that back in 2013 or so I'd used [hiccup](https://github.com/weavejester/hiccup) when building some web apps
in Clojure. So I looked to try to replicate that with TypeScript, and it worked surprisingly well (I thought so anyway. :) ).

So here's Hiccough - Hiccup, but for JavaScript and TypeScript.

## API

### Core Functions

- `html(content, options?)` - Render HTML content to a string
- `element(name, ...def)` - Create a custom HTML element
- `voidElement(name, attributes?)` - Create a void element (no closing tag)
- `raw(html)` - Mark a string as trusted raw HTML, bypassing escaping
- `elementf(name)` - Create a reusable element factory function for a given tag name
- `voidElementf(name)` - Create a reusable void element factory function for a given tag name

Example of `elementf()`:

```typescript
const section = elementf('section')

html(section({ class: 'main' }, p('Hello')))
// <section class="main"><p>Hello</p></section>
```

### Common Elements

Pre-defined element helpers: `div`, `p`, `span`, `h1`-`h4`, `table`, `tr`, `td`, `th`, `thead`, `tbody`, `form`, `label`, `button`, `i`, `b`, `a`, `title`, `script`, `head`, `body`, `htmlPage`

Void elements: `br`, `hr`, `img`, `input`, `meta`, `link`

Helper functions:

```typescript
html(unorderedList(['Apple', 'Banana', 'Cherry']), { newLines: true })
// <ul>
//   <li>Apple</li>
//   <li>Banana</li>
//   <li>Cherry</li>
// </ul>

html(orderedList(['First', 'Second', 'Third']), { newLines: true })
// <ol>
//   <li>First</li>
//   <li>Second</li>
//   <li>Third</li>
// </ol>

html(mailTo('user@example.com'))
// <a href="mailto:user@example.com">user@example.com</a>

html(mailTo('user@example.com', 'Contact Us'))
// <a href="mailto:user@example.com">Contact Us</a>

html(includeJs('app.js', 'vendor.js'))
// <script type="text/javascript" src="app.js"></script>
// <script type="text/javascript" src="vendor.js"></script>

html(includeCss('style.css', 'theme.css'))
// <link type="text/css" href="style.css" rel="stylesheet">
// <link type="text/css" href="theme.css" rel="stylesheet">
```

### Utilities

- `withAttributes(attributes, element)` - Add/merge attributes to an element
- `withOptions(options, ...content)` - Apply rendering options to a set of elements
- `inlineChildren` - Pre-built options constant that forces children to render inline (no newlines), while still respecting the parent's indentation. Useful when an element should be compact inside an otherwise pretty-printed structure.

### Types

For typing your own functions that accept or return hiccough values:

- `HiccoughElement` - A single HTML element object
- `HiccoughContent` - Anything that can appear as element content: `string | HiccoughElement | RawHtml | undefined`
- `HiccoughAttributes` - An attribute map: `Record<string, string>`
- `HiccoughOptions` - Rendering options (`newLines`, `eachIndent`, etc.)
- `HiccoughElementDefinition` - The argument type for `element()` and element factories
- `RawHtml` - The type returned by `raw()`

## License

MIT
