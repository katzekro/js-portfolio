const fs = require('fs')//modulo node filesystem

fs.writeFileSync('./.env',`API=${process.env.API}\n`)