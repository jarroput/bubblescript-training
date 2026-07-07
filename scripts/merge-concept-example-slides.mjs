#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const slidesPath = path.join(__dirname, '..', 'slides.md')

function splitSlides(raw) {
  const slides = []
  let headmatter = ''
  let current = ''
  let inFrontmatter = false
  let frontmatterLines = 0

  for (const line of raw.split('\n')) {
    if (slides.length === 0 && headmatter === '' && line.trim() === '---') {
      inFrontmatter = true
      headmatter = '---'
      continue
    }

    if (inFrontmatter) {
      headmatter += `\n${line}`
      if (line.trim() === '---') {
        inFrontmatter = false
      }
      continue
    }

    if (line.trim() === '---') {
      if (frontmatterLines > 0) {
        current += `\n${line}`
        frontmatterLines -= 1
        continue
      }

      if (current.trim()) {
        slides.push(current.trimEnd())
      }
      current = ''
      continue
    }

    if (current === '' && line.trim().startsWith('layout:')) {
      current = '---'
      frontmatterLines = 1
    }

    current += current ? `\n${line}` : line
  }

  if (current.trim()) {
    slides.push(current.trimEnd())
  }

  return { headmatter: headmatter.trimEnd(), slides }
}

function getTitle(slide) {
  const match = slide.match(/^## (.+)$/m)
  return match?.[1] ?? null
}

function stripSlideFrontmatter(slide) {
  return slide.replace(/^---\n([\s\S]*?)\n---\n\n/m, '')
}

function mergePair(conceptSlide, exampleSlide, title) {
  const conceptBody = stripSlideFrontmatter(conceptSlide)
    .replace(/^## .+\n\n/m, '')
    .trimEnd()

  const exampleBody = exampleSlide
    .replace(/^## .+ Example\n\n/m, '')
    .trimEnd()

  return `---
layout: two-cols-header
---

## ${title}

::left::

${conceptBody}

::right::

${exampleBody}`
}

function mergeConceptExampleSlides(raw) {
  const { headmatter, slides } = splitSlides(raw)
  const merged = []
  let i = 0

  while (i < slides.length) {
    const slide = slides[i]
    const title = getTitle(slide)

    if (
      title
      && !slide.includes('layout: two-cols-header')
      && i + 1 < slides.length
    ) {
      const nextTitle = getTitle(slides[i + 1])
      if (nextTitle === `${title} Example`) {
        merged.push(mergePair(slide, slides[i + 1], title))
        i += 2
        continue
      }
    }

    merged.push(slide)
    i += 1
  }

  return `${headmatter}\n\n---\n\n${merged.join('\n\n---\n\n')}\n`
}

const raw = fs.readFileSync(slidesPath, 'utf8')
const output = mergeConceptExampleSlides(raw)
fs.writeFileSync(slidesPath, output)

const pairs = (output.match(/layout: two-cols-header/g) ?? []).length
console.log(`Merged concept+example pairs. two-cols-header slides: ${pairs}`)
console.log('See docs/slide-authoring.md for the two-column slide pattern.')
