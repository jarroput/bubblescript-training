#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const bubblescriptKeywords = [
  'dialog', 'task', 'function', 'declare',
  'ask', 'assert', 'await', 'branch', 'break', 'buttons',
  'close', 'continue', 'dial', 'dial_bridge', 'dial_cancel',
  'elixir', 'emit', 'expect', 'expecting', 'fatal', 'forget',
  'goto', 'hold', 'invoke', 'log', 'mail', 'mock', 'once',
  'pause', 'perform', 'prompt', 'random', 'redirect', 'refer',
  'remember', 'repeat', 'reset', 'return', 'react', 'reply',
  'say', 'show', 'stop', 'submit', 'switch_language', 'switch_voice',
  'tag', 'talk', 'template', 'test', 'type', 'unhold', 'unmock',
  'unset', 'untag', 'wait', 'halt', 'fail', 'match',
]

async function loadElixirGrammar() {
  const mod = await import('@shikijs/langs/elixir')
  const grammar = mod.default.at(-1)
  if (!grammar || grammar.name !== 'elixir') {
    throw new Error('Could not load Elixir grammar from @shikijs/langs/elixir')
  }
  return structuredClone(grammar)
}

function mergeKeywords(pattern, extraKeywords) {
  const keywordMatch = pattern.match.match(/\\b\(([^)]+)\)\\b/)
  if (!keywordMatch) throw new Error('Could not find keyword list in control pattern')
  const existing = keywordMatch[1].split('|')
  const merged = [...new Set([...existing, ...extraKeywords])].sort()
  pattern.match = pattern.match.replace(
    /\\b\([^)]+\)\\b/,
    `\\b(${merged.join('|')})\\b`,
  )
}

async function main() {
  const grammar = await loadElixirGrammar()
  const patterns = grammar.repository.core_syntax.patterns

  const controlPattern = patterns.find(
    p => p.name === 'keyword.control.elixir' && p.match?.includes('defmodule'),
  )
  if (!controlPattern) throw new Error('Could not find keyword.control.elixir pattern')

  mergeKeywords(controlPattern, bubblescriptKeywords)

  patterns.splice(
    patterns.findIndex(p => p.name === 'variable.language.elixir') + 1,
    0,
    {
      match: '\\b(__[a-z_]+__)\\b(?![!?])',
      name: 'variable.language.elixir',
    },
  )

  grammar.name = 'bubblescript'
  grammar.displayName = 'Bubblescript'
  grammar.scopeName = 'source.bubblescript'
  grammar.fileTypes = ['bubble', 'bubblescript']
  grammar.firstLineMatch = '^#!/.*\\b(bubblescript|bubble|elixir)'
  delete grammar.embeddedLangs

  const outPath = path.join(ROOT, 'setup/bubblescript.tmLanguage.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, `${JSON.stringify(grammar, null, 2)}\n`)
  console.log(`Wrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})