# Hiccough

A HTML generation library / "internal DSL" for TypeScript. Generate HTML using composable functions instead of external templates.

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
          body(div({ id: 'top' }, h1('Hello'), table(tr(...['a', 'b', 'c'].map((x) => td(x))))))
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

- Type-checked HTML generation within standard TS files
- Composable element functions, allowing for loops, conditionals, etc.
- Support for attributes and nested content
- Optional formatting with indentation and newlines
- No runtime dependencies

## Background

I developed this code while writing [Cicada](https://github.com/symphoniacloud/cicada). Cicada generates HTML on the server side
both for pages, and fragments returned by HTMX-related calls. I didn't want to use an external templating library, but 
I wanted something more structured than just verbatim strings.

I remembered that back in 2013 or so I'd used [hiccup](https://github.com/weavejester/hiccup) when building some web apps
in Clojure. So I looked to try to replicate that with TypeScript, and it worked surprisingly well (I thought so anyway. :) ).

So here's Hiccough - Hiccup, but for TypeScript. It doesn't do everything Hiccup does, but it's enough for me.

## API

### Core Functions

- `html(content, options?)` - Render HTML content to a string
- `element(name, ...def)` - Create a custom HTML element

### Common Elements

Pre-defined element helpers: `div`, `p`, `span`, `h1`-`h4`, `table`, `tr`, `td`, `form`, `input`, `button`, etc.

### Utilities

- `withAttributes(attributes, element)` - Add/merge attributes to an element
- `withOptions(options, element)` - Apply rendering options to an element

## License

MIT
