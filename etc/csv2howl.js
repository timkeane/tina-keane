import {readFileSync, writeFileSync} from 'node:fs';
import { title } from 'node:process';
import papa from 'papaparse';

const csv = readFileSync('music.csv', {encoding: 'utf8'});
const data = papa.parse(csv, {
  quoteChar: '"',
  delimiter: ',',
  header: true,
  newline: '\n',
  skipEmptyLines: true
});
const music = [];

function addSong(band, row) {
  console.warn({band,row});
  
  music.push({
    band,
    title: row.Song,
    year: row.Year,
    songWriter: row['Song Writer'],
    leadVocals: row['Lead Vocals'],
    guitar: row.Guitar,
    bass: row.Bass,
    drums: row.Drums,
    backupVocals: row['Backup Vocals'],
    file: row.URL,
    howl: null

  });
}

let lastBand;
data.data.forEach(row => {
  const band = row.Band;
  if (band) {
    lastBand = band;
  }
  addSong(lastBand, row);
});

writeFileSync('howl.json', JSON.stringify(music, null, 2));
