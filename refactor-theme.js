const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'BentoDashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements to support Light Mode dynamically
content = content.replace(/bg-white\/\[0\.02\]/g, 'bg-foreground/[0.02]');
content = content.replace(/border-white\/10/g, 'border-foreground/10');
content = content.replace(/border-white\/5/g, 'border-foreground/5');
content = content.replace(/bg-white\/\[0\.01\]/g, 'bg-foreground/[0.01]');
content = content.replace(/bg-black\/20/g, 'bg-foreground/[0.04]');
content = content.replace(/bg-black\/10/g, 'bg-foreground/[0.02]');
content = content.replace(/bg-white\/5/g, 'bg-foreground/5');
content = content.replace(/bg-white\/10/g, 'bg-foreground/10');
content = content.replace(/bg-white\/20/g, 'bg-foreground/20');
content = content.replace(/text-white/g, 'text-foreground/90');
content = content.replace(/border-white\/20/g, 'border-foreground/20');
content = content.replace(/hover:bg-white\/5/g, 'hover:bg-foreground/5');
content = content.replace(/hover:border-white\/10/g, 'hover:border-foreground/10');

fs.writeFileSync(filePath, content, 'utf8');
console.log('BentoDashboard refactored for theme support!');
