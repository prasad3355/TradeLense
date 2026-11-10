const fs = require('fs');
let content = fs.readFileSync('src/app/routes/app/Journal.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/routes/app/Journal.tsx', content);
