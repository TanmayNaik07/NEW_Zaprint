const fs = require('fs');
let svg = fs.readFileSync('public/images/tape.svg', 'utf8');
console.log('Contains rect:', svg.includes('<rect'));
console.log('viewBox:', svg.match(/viewBox=\"([^\"]+)\"/)[1]);
