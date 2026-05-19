#!/usr/bin/env node
// Checks that all locale files have the same set of keys.
// Run with: node scripts/check-i18n-keys.mjs
// Exits 1 if any locale is missing keys or has extra keys vs the reference locale.

import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCALES_DIR = join(__dirname, '..', 'i18n', 'locales')
const REFERENCE = 'en.json'

function flatten(obj, prefix = '') {
  const keys = []
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flatten(v, path))
    } else {
      keys.push(path)
    }
  }
  return keys
}

function load(file) {
  return JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf-8'))
}

const files = readdirSync(LOCALES_DIR).filter(f => f.endsWith('.json'))
if (!files.includes(REFERENCE)) {
  console.error(`Reference locale "${REFERENCE}" not found in ${LOCALES_DIR}`)
  process.exit(1)
}

const refKeys = new Set(flatten(load(REFERENCE)))
let hasError = false

for (const file of files) {
  if (file === REFERENCE) continue
  const keys = new Set(flatten(load(file)))
  const missing = [...refKeys].filter(k => !keys.has(k))
  const extra = [...keys].filter(k => !refKeys.has(k))
  if (missing.length || extra.length) {
    hasError = true
    console.error(`\n${file} differs from ${REFERENCE}:`)
    if (missing.length) console.error(`  missing keys (${missing.length}):\n    - ${missing.join('\n    - ')}`)
    if (extra.length) console.error(`  extra keys (${extra.length}):\n    - ${extra.join('\n    - ')}`)
  } else {
    console.log(`${file}: OK (${keys.size} keys)`)
  }
}

if (hasError) {
  console.error('\ni18n key parity check FAILED')
  process.exit(1)
} else {
  console.log('\ni18n key parity check passed')
}
