import sharp from 'sharp'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const src = join(root, 'asset-src')

// Ensure output directories exist
mkdirSync(join(root, 'public', 'journey'), { recursive: true })

const tasks = [
  // Backdrop images: resize 1920w, webp q75
  { in: 'bg-decollo.png',     out: 'public/journey/bg-decollo.webp',    op: 'backdrop' },
  { in: 'bg-origini.png',     out: 'public/journey/bg-origini.webp',    op: 'backdrop' },
  { in: 'bg-frontend-v2.png', out: 'public/journey/bg-frontend.webp',   op: 'backdrop' },
  { in: 'bg-backend.png',     out: 'public/journey/bg-backend.webp',    op: 'backdrop' },
  { in: 'bg-maserati.png',    out: 'public/journey/bg-maserati.webp',   op: 'backdrop' },
  { in: 'bg-boop.png',        out: 'public/journey/bg-boop.webp',       op: 'backdrop' },
  { in: 'bg-finale.png',      out: 'public/journey/bg-finale.webp',     op: 'backdrop' },
  { in: 'scrivania.png',      out: 'public/journey/scrivania.webp',     op: 'backdrop' },
  // Alpha images: resize 1024w, webp q85, preserve alpha
  { in: 'castello-v2-alpha.png',  out: 'public/journey/castello-salemi.webp', op: 'alpha' },
  { in: 'francois-cane-alpha.png', out: 'public/journey/francois-cane.webp',  op: 'alpha' },
  // OG image: cover crop 1200x630, jpeg q85
  { in: 'og-image.png',       out: 'public/og.jpg',        op: 'og' },
  // Favicons
  { in: 'favicon.png',        out: 'public/favicon.png',          op: 'favicon512' },
  { in: 'favicon.png',        out: 'public/favicon-32.png',       op: 'favicon32' },
  { in: 'favicon.png',        out: 'public/apple-touch-icon.png', op: 'apple-touch' },
]

async function processTask(task) {
  const inputPath = join(src, task.in)
  const outputPath = join(root, task.out)

  if (!existsSync(inputPath)) {
    console.error(`  MISSING input: ${task.in}`)
    process.exit(1)
  }

  let pipeline = sharp(inputPath)

  switch (task.op) {
    case 'backdrop':
      pipeline = pipeline
        .resize({ width: 1920 })
        .webp({ quality: 75 })
      break
    case 'alpha':
      pipeline = pipeline
        .resize({ width: 1024 })
        .webp({ quality: 85 })
      break
    case 'og':
      pipeline = pipeline
        .resize(1200, 630, { fit: 'cover' })
        .jpeg({ quality: 85 })
      break
    case 'favicon512':
      pipeline = pipeline
        .resize(512, 512)
        .png()
      break
    case 'favicon32':
      pipeline = pipeline
        .resize(32, 32)
        .png()
      break
    case 'apple-touch':
      pipeline = pipeline
        .resize(180, 180)
        .png()
      break
  }

  await pipeline.toFile(outputPath)
  const kb = Math.round(statSync(outputPath).size / 1024)
  console.log(`  ${task.out.padEnd(40)} ${kb} KB`)
  return { path: task.out, kb, op: task.op }
}

console.log('Optimizing assets...\n')
const results = []
for (const task of tasks) {
  const result = await processTask(task)
  results.push(result)
}

console.log('\nDone! Summary:')
const backdrops = results.filter(r => r.op === 'backdrop')
const oversized = backdrops.filter(r => r.kb > 700)
if (oversized.length > 0) {
  console.warn('\nWARNING: These backdrop webps exceed 700KB:')
  oversized.forEach(r => console.warn(`  ${r.path}: ${r.kb} KB`))
  console.warn('Re-running with quality=70 for oversized items...\n')

  for (const item of oversized) {
    const task = tasks.find(t => t.out === item.path)
    const inputPath = join(src, task.in)
    const outputPath = join(root, task.out)
    await sharp(inputPath)
      .resize({ width: 1920 })
      .webp({ quality: 70 })
      .toFile(outputPath)
    const kb = Math.round(statSync(outputPath).size / 1024)
    console.log(`  [rerun q70] ${task.out.padEnd(40)} ${kb} KB`)
  }
}

console.log('\nAll outputs produced.')
