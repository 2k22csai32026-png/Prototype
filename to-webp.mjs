import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)

    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.png') && entry.name !== 'og-image.png') {
      sharp(full)
        .webp({ quality: 82 })
        .toFile(full.replace(/\.png$/, '.webp'))
        .then(() => console.log('done:', full))
    }
  }
}

walk('public/images')