import playlist from '../js/playlist/tina.js';

let csv = '"Band","Song","Song Wirter","Lead Vocals","Guitar","Bass","Piano","Drums","Backup Vocals"\n';
playlist.forEach(song => {
  csv += `"${song.band}","${song.title}","${song.attribution[0][1]}","${song.attribution[1][1]}","${song.attribution[2][1]}","${song.attribution[3][1]}","${song.attribution[4][1]}","${song.attribution[5][1]}","${song.attribution[6][1]}"\n`;
});

console.warn(csv);