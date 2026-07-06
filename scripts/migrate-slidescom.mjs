#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const EXPORT_DIR = process.env.SLIDESCOM_EXPORT
  ?? path.join(process.env.HOME, 'Downloads/slides_bubblescript-basic-training (1)')
const HTML_PATH = path.join(EXPORT_DIR, 'index.html')
const PUBLIC_DIR = path.join(ROOT, 'public')
const OUT_JSON = path.join(ROOT, 'scripts', 'slidescom-parsed.json')
const OUT_MD = path.join(ROOT, 'slides.md')

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&nbsp;/g, ' ')
}

function stripTags(html) {
  return decodeHtml(html.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').trim())
}

function convertLinks(html) {
  return html.replace(/(?:<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>)+/gi, (match) => {
    const parts = [...match.matchAll(/href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    if (!parts.length) return match
    const href = parts.at(-1)[1]
    const text = parts.map(p => stripTags(p[2])).join('')
    return `[${text || href}](${href})`
  })
}

function htmlToMarkdown(html) {
  let md = convertLinks(html.trim())
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `# ${stripTags(c)}\n\n`)
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `## ${stripTags(c)}\n\n`)
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `### ${stripTags(c)}\n\n`)
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => `- ${stripTags(c)}\n`)
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, c) => `${c}\n`)
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, c) => `${c}\n`)
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `${stripTags(c)}\n\n`)
  md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
  md = md.replace(/<[^>]+>/g, '')
  return decodeHtml(md).replace(/\n{3,}/g, '\n\n').trim()
}

function parseStyle(style) {
  const out = {}
  for (const part of style.split(';')) {
    const [k, v] = part.split(':').map(s => s?.trim())
    if (k && v) out[k] = v
  }
  return out
}

function findMatchingCloseTag(html, openIdx, tag) {
  const openTag = `<${tag}`
  const closeTag = `</${tag}>`
  let depth = 0
  let i = openIdx
  while (i < html.length) {
    if (html.startsWith(openTag, i)) {
      depth++
      i += openTag.length
      continue
    }
    if (html.startsWith(closeTag, i)) {
      depth--
      i += closeTag.length
      if (depth === 0) return i
      continue
    }
    i++
  }
  return html.length
}

function extractSlidesHtml(html) {
  const marker = '<div class="slides">'
  const start = html.indexOf(marker) + marker.length
  let depth = 1
  let i = start
  while (i < html.length && depth > 0) {
    if (html.startsWith('<div', i)) {
      depth++
      i += 4
      continue
    }
    if (html.startsWith('</div>', i)) {
      depth--
      i += 6
      if (depth === 0) return html.slice(start, i - 6)
      continue
    }
    i++
  }
  return ''
}

function parseTopSections(slidesHtml) {
  const sections = []
  let i = 0
  while (i < slidesHtml.length) {
    const open = slidesHtml.indexOf('<section', i)
    if (open === -1) break
    const close = findMatchingCloseTag(slidesHtml, open, 'section')
    sections.push(slidesHtml.slice(open, close))
    i = close
  }
  return sections
}

function parseChildSections(sectionHtml) {
  const inner = sectionHtml.replace(/^<section[^>]*>/, '').replace(/<\/section>$/, '')
  const children = []
  let i = 0
  while (i < inner.length) {
    const open = inner.indexOf('<section', i)
    if (open === -1) break
    const close = findMatchingCloseTag(inner, open, 'section')
    children.push(inner.slice(open, close))
    i = close
  }
  return children
}

function extractBlocks(sectionHtml) {
  const blocks = []
  let searchFrom = 0

  while (searchFrom < sectionHtml.length) {
    const typeIdx = sectionHtml.indexOf('data-block-type="', searchFrom)
    if (typeIdx === -1) break

    const typeMatch = sectionHtml.slice(typeIdx).match(/^data-block-type="([^"]+)"/)
    if (!typeMatch) break
    const type = typeMatch[1]

    const blockOpen = sectionHtml.lastIndexOf('<div class="sl-block', typeIdx)
    if (blockOpen === -1) {
      searchFrom = typeIdx + 1
      continue
    }

    const blockClose = findMatchingCloseTag(sectionHtml, blockOpen, 'div')
    const blockHtml = sectionHtml.slice(blockOpen, blockClose)
    searchFrom = blockClose

    const styleMatch = blockHtml.match(/style="([^"]*)"/)
    const style = styleMatch ? parseStyle(styleMatch[1]) : {}
    const top = Number.parseFloat(style.top ?? '9999')
    const left = Number.parseFloat(style.left ?? '0')

    if (type === 'text') {
      const contentMatch = blockHtml.match(/<div class="sl-block-content"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*$/)
      if (contentMatch) {
        blocks.push({ type: 'text', top, left, markdown: htmlToMarkdown(contentMatch[1]) })
      }
    }
    else if (type === 'code') {
      const preMatch = blockHtml.match(/<pre[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/pre>/)
      const codeMatch = preMatch?.[2]?.match(/<code(?:[^>]*)?>([\s\S]*?)<\/code>/)
      const lineNumbers = blockHtml.match(/data-line-numbers="([^"]+)"/)?.[1]
      const lang = preMatch?.[1]?.split(/\s+/).find(c => c && !['notranslate'].includes(c)) ?? 'text'
      if (codeMatch) {
        blocks.push({
          type: 'code',
          top,
          left,
          lang: lang === 'elixir' ? 'bubblescript' : lang,
          code: decodeHtml(codeMatch[1]),
          lineNumbers,
        })
      }
    }
    else if (type === 'image') {
      const src = blockHtml.match(/data-src="([^"]+)"/)?.[1]
      const alt = blockHtml.match(/data-name="([^"]+)"/)?.[1] ?? 'image'
      if (src) blocks.push({ type: 'image', top, left, src, alt })
    }
    else if (type === 'iframe') {
      const src = blockHtml.match(/data-src="([^"]+)"/)?.[1]
      if (src) blocks.push({ type: 'iframe', top, left, src })
    }
    else if (type === 'group') {
      const innerMatch = blockHtml.match(/sl-block-group-content"[^>]*>([\s\S]*)<\/div>\s*<\/div>\s*$/)
      if (innerMatch) blocks.push(...extractBlocks(innerMatch[1]))
    }
  }

  blocks.sort((a, b) => a.top - b.top || a.left - b.left)
  return blocks
}

function flattenSections(sectionHtml) {
  const isStack = /class="[^"]*\bstack\b/.test(sectionHtml)
  const idMatch = sectionHtml.match(/\sid="([^"]+)"/)
  const id = idMatch?.[1]

  if (isStack) {
    return parseChildSections(sectionHtml).flatMap(child => flattenSections(child))
  }

  return [{ id, blocks: extractBlocks(sectionHtml) }]
}

function extractSections(html) {
  const slidesHtml = extractSlidesHtml(html)
  return parseTopSections(slidesHtml).flatMap(section => flattenSections(section))
}

function copyAssets(slides) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
  const copied = new Map()

  for (const slide of slides) {
    for (const block of slide.blocks) {
      if (block.type !== 'image') continue
      const basename = path.basename(block.src)
      const srcPath = path.join(EXPORT_DIR, block.src)
      const destPath = path.join(PUBLIC_DIR, basename)
      if (!fs.existsSync(srcPath)) {
        console.warn(`Missing asset: ${srcPath}`)
        continue
      }
      if (!fs.existsSync(destPath)) fs.copyFileSync(srcPath, destPath)
      copied.set(block.src, `./public/${basename}`)
    }
  }

  return copied
}

function inferLayout(slide) {
  const types = slide.blocks.map(b => b.type)
  const hasIframe = types.includes('iframe')
  const hasCode = types.includes('code')
  const hasImage = types.includes('image')
  const textBlocks = slide.blocks.filter(b => b.type === 'text')
  const title = textBlocks.map(b => b.markdown).join('\n')

  if (slide.blocks.length <= 2 && slide.blocks.some(b => b.type === 'text' && /^#\s/.test(b.markdown))) {
    return 'cover'
  }
  if (hasIframe && !hasCode) return 'iframe'
  if (hasCode && hasImage) return 'two-cols'
  if (!hasCode && !hasIframe && textBlocks.length >= 1 && title.length < 120 && !title.includes('\n\n')) {
    return 'center'
  }
  return 'default'
}

function formatCode(block) {
  const meta = block.lineNumbers ? ` {${block.lineNumbers}}` : ''
  return `\`\`\`${block.lang}${meta}\n${block.code.trimEnd()}\n\`\`\``
}

function toSlidevMarkdown(slides, assetMap) {
  const headmatter = `---
theme: default
title: Bubblescript Basics
info: |
  Half-day Bubblescript training for new DialoX users and solution consultants.
  Migrated from Slides.com export.
css: unocss
---

<style src="./styles/theme.css"></style>

`

  const parts = [headmatter]

  for (const slide of slides) {
    const layout = inferLayout(slide)
    const frontmatter = []
    if (layout !== 'default') frontmatter.push(`layout: ${layout}`)
    if (slide.id) frontmatter.push(`id: ${slide.id}`)

    if (frontmatter.length) parts.push(`---\n${frontmatter.join('\n')}\n---\n\n`)
    else parts.push('---\n\n')

    const textBlocks = slide.blocks.filter(b => b.type === 'text')
    const codeBlocks = slide.blocks.filter(b => b.type === 'code')
    const imageBlocks = slide.blocks.filter(b => b.type === 'image')
    const iframeBlocks = slide.blocks.filter(b => b.type === 'iframe')

    if (layout === 'two-cols' && codeBlocks.length && imageBlocks.length) {
      if (textBlocks.length) parts.push(`${textBlocks.map(b => b.markdown).join('\n\n')}\n\n`)
      parts.push(`${codeBlocks.map(b => formatCode(b)).join('\n\n')}\n\n`)
      parts.push('::right::\n\n')
      for (const img of imageBlocks) {
        const url = assetMap.get(img.src) ?? img.src
        parts.push(`![${img.alt}](${url})\n\n`)
      }
    }
    else if (layout === 'iframe') {
      if (textBlocks.length) parts.push(`${textBlocks.map(b => b.markdown).join('\n\n')}\n\n`)
      const src = iframeBlocks[0]?.src
      if (src) {
        parts.push(`<iframe src="${src}" width="100%" height="520" frameborder="0" allow="fullscreen"></iframe>\n\n`)
        parts.push(`<div class="lookup">\n\n[Open demo](${src})\n\n</div>\n\n`)
      }
    }
    else {
      const orderedBlocks = layout === 'cover'
        ? [
            ...slide.blocks.filter(b => b.type === 'text'),
            ...slide.blocks.filter(b => b.type !== 'text'),
          ]
        : slide.blocks

      for (const block of orderedBlocks) {
        if (block.type === 'text') parts.push(`${block.markdown}\n\n`)
        else if (block.type === 'code') parts.push(`${formatCode(block)}\n\n`)
        else if (block.type === 'image') {
          const url = assetMap.get(block.src) ?? block.src
          parts.push(`![${block.alt}](${url})\n\n`)
        }
        else if (block.type === 'iframe') {
          parts.push(`<iframe src="${block.src}" width="100%" height="520" frameborder="0" allow="fullscreen"></iframe>\n\n`)
          parts.push(`<div class="lookup">\n\n[Open demo](${block.src})\n\n</div>\n\n`)
        }
      }
    }
  }

  return parts.join('').trimEnd() + '\n'
}

function main() {
  if (!fs.existsSync(HTML_PATH)) {
    console.error(`Export not found: ${HTML_PATH}`)
    process.exit(1)
  }

  const html = fs.readFileSync(HTML_PATH, 'utf8')
  const slides = extractSections(html)
  fs.writeFileSync(OUT_JSON, JSON.stringify(slides, null, 2))

  const assetMap = copyAssets(slides)
  const markdown = toSlidevMarkdown(slides, assetMap)
  fs.writeFileSync(OUT_MD, markdown)

  console.log(`Parsed ${slides.length} slides`)
  console.log(`Copied ${assetMap.size} images to public/`)
  console.log(`Wrote ${OUT_MD}`)
}

main()
