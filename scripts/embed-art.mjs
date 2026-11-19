#!/usr/bin/env node
/**
 * Embed locally prepared character artwork into `client.js`.
 *
 * Place these files in `art/` (ids: yuno, arale, nonoka, ritsu, miyako):
 *   art/<id>-portrait.webp   standing artwork, ~700x900 px, transparent
 *   art/<id>-avatar.webp     square face crop, ~160x160 px
 *
 * Then run `node scripts/embed-art.mjs`. The script replaces the marked
 * CAST_ART block; `git checkout -- client.js` restores the artwork-free build.
 * You are responsible for the rights to any artwork you embed.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const IDS = ['yuno', 'arale', 'nonoka', 'ritsu', 'miyako']
const START = '/* ==== CAST-ART-START ==== */'
const END = '/* ==== CAST-ART-END ==== */'

const clientPath = join(ROOT, 'client.js')
const source = await readFile(clientPath, 'utf8')
const startAt = source.indexOf(START)
const endAt = source.indexOf(END)
if (startAt < 0 || endAt < 0 || endAt <= startAt) {
  throw new Error('CAST-ART markers are missing from client.js')
}

const entries = []
for (const id of IDS) {
  const portrait = (await readFile(join(ROOT, 'art', `${id}-portrait.webp`))).toString('base64')
  const avatar = (await readFile(join(ROOT, 'art', `${id}-avatar.webp`))).toString('base64')
  entries.push(
    `      ${id}: {\n`
    + `        portrait: 'data:image/webp;base64,${portrait}',\n`
    + `        avatar: 'data:image/webp;base64,${avatar}',\n`
    + '      },',
  )
}

const block = `${START}\n    const CAST_ART = {\n${entries.join('\n')}\n    }\n    ${END}`
const next = source.slice(0, startAt) + block + source.slice(endAt + END.length)
await writeFile(clientPath, next)
console.log(`Embedded artwork for ${IDS.length} characters into client.js`)
