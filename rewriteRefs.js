const detectNewline = require('detect-newline');
const fs = require('fs-extra')

const config = require('./config')

const main = async () => {
  const headRegEx = /refs\/heads\/pr([0-9]+)head/
  const refsPath = `${config.source.repo}.git/packed-refs`
  const refsText = await fs.readFile(refsPath, { encoding: 'utf-8' })
  const newline = detectNewline.graceful(refsText);
  const refs = refsText
    .split(newline)
    .map(ref => ref.replace(/refs\/pull\/([0-9]+)\/head/, 'refs/heads/pr$1head'))
    .join(newline)
  await fs.move(refsPath, `${refsPath}.back`)
  await fs.writeFile(refsPath, refs)
}

main()
  .catch(err => {
    console.error('Error:', err)
  })
