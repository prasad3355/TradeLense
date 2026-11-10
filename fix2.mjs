import fs from 'fs/promises';
let content = await fs.readFile('src/app/routes/app/Journal.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');
await fs.writeFile('src/app/routes/app/Journal.tsx', content);
