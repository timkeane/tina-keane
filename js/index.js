import $ from 'jquery';
import {Howl, Howler} from 'howler';

window.Howler=Howler;

function playPause(event) {
  console.warn(event);
  const button = $(event.target);
  const audio = button.data('audio');
  button[audio.playing() ? 'removeClass' : 'addClass']('playing');
  audio[audio.playing() ? 'pause' : 'play']();

  console.warn(audio);
}

function nowPlaying(event) {
  console.warn(event);
  
}

function playlist(bandElem, songs) {
  const src = [];
  Object.keys(songs).forEach(song => src.push(songs[song].url));
  const audio = new Howl({
    autoplay: false,
    loop: true,
    onplay: nowPlaying,
    src
  });
  const player = $('<div class="player"></div>')
    .data('audio', audio)
    .on('click', playPause);
  bandElem.append(player);
}

function toId(str) {
  return str.replace(/\W/, '-');
}

function bandSongs(event) {
  console.warn(event.target);
  
  const bandElem = $(event.target);
  const songsElem = bandElem.parent().find('.songs');
  const playerElem = bandElem.parent().find('.player');
  $('.songs').slideUp();
  $('.player').hide();
  if (songsElem.children().length === 0) {
    const songs = music[bandElem.html()];
    Object.keys(songs).forEach(song => {
      const songElem = $('<div class="song"></div>');
      const a = $(`<a href="#">${song}</a>`)
        .attr('id', toId(song))
        .on('click', songDetails);
      songElem.append(a);
      songsElem.append(songElem);
    });
  }
  songsElem.slideDown();
  playerElem.css('display', 'inline-block');
}

function songDetails(event) {
  const song = music[band][songName];
  console.warn(song);
}

let music;
fetch('./public/data/music.json').then(response => {
  response.json().then(json => {
    music = json;
    Object.keys(music).forEach(band => {
      console.warn(band);
      const bandElem = $('<div class="band"></div>');
      const songsElem = $('<div class="songs"></div>');
      const a = $(`<a href="#">${band}</a>`)
        .on('click', bandSongs);
      bandElem.append(a);
      $('#bands').append(bandElem);
      playlist(bandElem, music[band]);
      bandElem.append(songsElem);
    });
  });
});

window.bandSongs = bandSongs;
window.songDetails = songDetails;
