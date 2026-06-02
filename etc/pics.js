import {readFileSync, writeFileSync} from 'node:fs';
import papa from 'papaparse';

const csv = readFileSync('files.txt', {encoding: 'utf8'});
const data = papa.parse(csv, {
  quoteChar: '"',
  delimiter: ',',
  header: false,
  newline: '\n',
  skipEmptyLines: true
});
const pics = [];


data.data.forEach(row => {
  pics.push(row[0])
});

writeFileSync('pics.json', JSON.stringify(pics, null, 2));
