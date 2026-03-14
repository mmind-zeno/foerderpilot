const sharp = require('sharp')
const path = require('path')

async function optimize() {
  const input = path.join(__dirname, 'pics/foerderpilot-header-1.png')
  const output = path.join(__dirname, 'app/src/assets/header.jpg')

  await sharp(input)
    .resize(1440, 560, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 82, progressive: true })
    .toFile(output)

  const { size } = require('fs').statSync(output)
  console.log('Optimiert:', Math.round(size / 1024) + ' KB →', output)
}

optimize().catch(console.error)
