const fs = require('fs');

let svg = fs.readFileSync('tape.svg', 'utf8');

// Replace viewBox
svg = svg.replace(/viewBox=\"0 0 1440 \d+(\.\d+)?\"/, 'viewBox="464.8 203 83.25 89.88"');

// Remove white background rectangles
svg = svg.replace(/<rect[^>]*fill=\"#ffffff\"[^>]*\/>/g, '');

fs.writeFileSync('public/images/tape.svg', svg);
console.log('Fixed tape.svg!');
