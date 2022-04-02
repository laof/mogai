const fs = require('fs')
const path = require('path')

// create a file to stream archive data to.
const page = path.join(__dirname, '..', 'mogai', 'index.html')

// Create a readable stream
let txt = fs.readFileSync(page).toString()

// media="print" onload="this.media='all'"
txt = txt.replace(`media="print"`, '')
txt = txt.replace(`onload="this.media='all'"`, '')

fs.writeFileSync(page, txt)

console.log('=== rewrite successful ===')

process.exit(0)
