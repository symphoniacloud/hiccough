import { isNotNullObject } from './util/types.js'

export type HiccoughAttributes = Record<string, string>

export type RawHtml = { readonly _raw: string }

export type HiccoughContent = string | HiccoughElement | RawHtml | undefined

export type HiccoughOptions = {
  newLines?: boolean
  indentFromParent?: boolean
  eachIndent?: string
  indentCount?: number
}

export type HiccoughElement = {
  isElement: true
  name: string
  voidElement?: boolean
  attributes?: HiccoughAttributes
  content?: HiccoughContent[]
  options?: HiccoughOptions
}

function isHiccoughElement(x: unknown): x is HiccoughElement {
  return isNotNullObject(x) && 'isElement' in x && typeof x.isElement === 'boolean' && x.isElement
}

export function isRawHtml(x: unknown): x is RawHtml {
  return isNotNullObject(x) && '_raw' in x && typeof x._raw === 'string'
}

function isHiccoughContent(x: unknown): x is HiccoughContent {
  const xtype = typeof x
  return xtype === 'undefined' || xtype === 'string' || isHiccoughElement(x) || isRawHtml(x)
}

export type HiccoughElementDefinition = HiccoughContent[] | [HiccoughAttributes | HiccoughContent, ...HiccoughContent[]]

export function raw(html: string): RawHtml {
  return { _raw: html }
}

// First element of def can be either attributes or content
export function element(name: string, ...def: HiccoughElementDefinition): HiccoughElement {
  const baseElement: HiccoughElement = { isElement: true, name }
  const [first, ...rest] = def

  return isHiccoughContent(first)
    ? { ...baseElement, content: def as HiccoughContent[] }
    : {
        ...baseElement,
        attributes: first,
        content: rest as HiccoughContent[]
      }
}

export function voidElement(name: string, attributes?: HiccoughAttributes): HiccoughElement {
  return { isElement: true, voidElement: true, name, ...(attributes ? { attributes } : {}) }
}

export function withAttributes(attributes: HiccoughAttributes, element: HiccoughElement): HiccoughElement {
  return {
    ...element,
    attributes: {
      ...element.attributes,
      ...attributes
    }
  }
}

export function withOptions(options: HiccoughOptions, element: HiccoughElement): HiccoughElement {
  return {
    ...element,
    options
  }
}

export const inlineChildren: HiccoughOptions = {
  indentFromParent: true,
  newLines: false
}
