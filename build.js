const cssnano = require('cssnano')
const UglifyJS = require('uglify-es') // for let support
const htmlMinifier = require('html-minifier').minify
const fs = require('fs')
const path = require('path')
const fsDir = path.resolve('./fs_dev')
const fsMinDir = path.resolve('./fs')
const files = fs.readdirSync(fsDir)

if (fs.existsSync(fsMinDir)) {
  const files = fs.readdirSync(fsMinDir)
  for (let file of files) {
    try {
      fs.unlinkSync(path.resolve('./fs/' + file))
    } catch (e) {
      console.error(e)
    }
  }
} else {
  fs.mkdirSync(fsMinDir)
}
for (let file of files) {
  const ext = (file === 'init.js' || /\.min\./i.test(file)) ? false : path.extname(file)
  const fileIn = path.resolve('./fs_dev/' + file)
  const fileOut = path.resolve('./fs/' + file)
  switch (ext) {
    case '.js': {
      const res = UglifyJS.minify(fs.readFileSync(fileIn, 'utf8'))
      if (res.error) {
        console.error('File: ', file, fileOut)
        console.error(res.error)
      } else {
        fs.writeFileSync(fileOut, res.code)
      }
      break
    }
    case '.html': {
      fs.writeFileSync(fileOut, htmlMinifier(fs.readFileSync(fileIn, 'utf8'), {
        collapseWhitespace: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeAttributeQuotes: true,
        minifyCSS: true,
        minifyJS: true,
        preventAttributesEscaping: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeTagWhitespace: true,
        useShortDoctype: true
      }))
      break
    }
    case '.css': {
      cssnano.process(fs.readFileSync(fileIn), {
        from: file
      }, {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }]
      }).then(result => {
        fs.writeFileSync(fileOut, result)
      })
      break
    }
    // to do minify email
    case '.png':
    case '.gif':
    case '.jpeg':
    case '.jpg':
    // default: copy file
    // eslint-disable-next-line
    default: {
      fs.createReadStream(fileIn).pipe(fs.createWriteStream(fileOut))
    }
  }
}
