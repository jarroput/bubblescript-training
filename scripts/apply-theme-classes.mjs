#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const slidesPath = path.join(__dirname, '..', 'slides.md')

const FRONTMATTER = `---
theme: default
title: Bubblescript Basics
colorSchema: light
background: '#faf9fc'
fonts:
  sans: Inter
  serif: Inter
  mono: JetBrains Mono
  provider: google
themeConfig:
  primary: '#883ad0'
defaults:
  zoom: 0.8
info: |
  Half-day Bubblescript training for new DialoX users and solution consultants.
css: unocss
---

<div class="chapter-label">Enreach · DialoX</div>

# Bubblescript Basics

Read, write, and extend conversational bots in DialoX.

<div class="lookup">
Half-day workshop - Starbucks storyline - Concept, example, exercise, lookup
</div>
`

function wrapBlock(label, className, body) {
  const pattern = new RegExp(
    `(^${label}:\\n\\n)([\\s\\S]*?)(?=\\n\\n(?:Example target:|Example pattern:|Example user text:|Example:|Try to classify:|Goal:|This matches:|Check yourself:|<div class="lookup">|---|\`\`\`[a-z]))`,
    'gm',
  )

  return body.replace(pattern, (_, header, content) => {
    if (content.includes(`class="${className}"`)) return _
    return `<div class="${className}">\n\n${header}${content.trimEnd()}\n\n</div>\n\n`
  })
}

function wrapExampleTarget(body) {
  return body.replace(
    /^Example target:\n\n([\s\S]*?)(?=\n\n(?:Check yourself:|<div class="lookup">|---))/gm,
    (_, content) => `<div class="pattern">\n\nExample target:\n\n${content.trimEnd()}\n\n</div>\n\n`,
  )
}

function wrapExamplePattern(body) {
  return body.replace(
    /^Example pattern:\n\n([\s\S]*?)(?=\n\n(?:This matches:|Try to classify:|<div class="lookup">|---))/gm,
    (_, content) => `<div class="pattern">\n\nExample pattern:\n\n${content.trimEnd()}\n\n</div>\n\n`,
  )
}

function wrapCheckYourself(body) {
  return body.replace(
    /^Check yourself:\n\n([\s\S]*?)(?=\n\n<div class="lookup">)/gm,
    (_, content) => `<div class="warning">\n\nCheck yourself:\n\n${content.trimEnd()}\n\n</div>\n\n`,
  )
}

function transformSlides(raw) {
  const parts = raw.split(/\n---\n/)
  const head = parts[0]
  const rest = parts.slice(1)

  const transformed = rest.map((slide) => {
    let body = slide.trimStart()
    if (body.startsWith('<style src="./styles/theme.css"></style>')) return ''

    body = wrapBlock('Concept', 'concept', body)
    body = wrapBlock('Exercise', 'exercise', body)
    body = wrapExampleTarget(body)
    body = wrapExamplePattern(body)
    body = wrapCheckYourself(body)

    return body.trimEnd()
  }).filter(Boolean)

  return `${FRONTMATTER.trimEnd()}\n\n---\n\n${transformed.join('\n\n---\n\n')}\n`
}

const raw = fs.readFileSync(slidesPath, 'utf8')
const output = transformSlides(raw)
fs.writeFileSync(slidesPath, output)
console.log('Updated slides.md with Enreach theme classes')
