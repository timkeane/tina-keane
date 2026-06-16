import $ from 'jquery';
import {Howl, Howler} from 'howler';

class Player {
  constructor(playlist) {
    this.playlist = playlist;
    this.currentSong = null;
    this.index = 0;
    this.shuffling = false;
    this.paused = false;

    let band = '';
    playlist.forEach(song => {
      if (band !== song.band) {
        const bandDiv = $(`<div class="list-band">${song.band}</div>`);
        if (band !== '') $(bandDiv).addClass('band-margin');
        $('#list').append(bandDiv);
        band = song.band;
      }
      const songDiv = $(`<a class="list-song" tabindex="0" href="#" title="Play ${song.title}" aria-label="Play ${song.title}">${song.title}</a>`)
        .on('click', () => {
          this.skipTo(playlist.indexOf(song));
        });
      $('#list').append(songDiv);
    });
    this.addEventListeners();
  }
  play(index) {
    let sound;
    if (this.shuffling && !this.paused) {
        this.index = Math.floor(Math.random() * this.playlist.length);
    }
    if (index) this.shuffling = false;
    index = typeof index === 'number' ? index : this.index;
    const data = this.playlist[index];
    this.paused = false;
    this.currentSong = data;
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: [`./${data.file}`],
        html5: true,
        onplay: () => {
          $('#duration').html(this.formatTime(Math.round(sound.duration())));
          window.requestAnimationFrame(this.step.bind(this));
          $('#pause-btn').show();
        },
        onload: () => {
          $('#loading').hide();
        },
        onend: () => {
          this.skip('next');
        },
        onpause: () => {},
        onstop: () => {},
        onseek: () => {
          window.requestAnimationFrame(this.step.bind(this));
        }
      });
    }
    sound.play();
    $('#band').html(data.band);
    $('#track').html(data.title);
    if (sound.state() === 'loaded') {
      $('#play-btn').hide();
      $('#pause-btn').show();
    } else {
      $('#loading').show();
      $('#play-btn').hide();
      $('#pause-btn').hide();
    }
    this.index = index;
  }
  shuffle() {
    const sound = this.playlist[this.index].howl;
    if (sound) sound.stop();
    this.shuffling = true;
    this.play();
  }
  pause() {
    const sound = this.playlist[this.index].howl;
    sound.pause();
    this.paused = true;
    $('#play-btn').show();
    $('#pause-btn').hide();
  }
  skip(direction) {
    if (this.shuffling) {
      this.skipTo();
    } else {
      let index = 0;
      if (direction === 'prev') {
        index = this.index - 1;
        if (index < 0) {
          index = this.playlist.length - 1;
        }
      } else {
        index = this.index + 1;
        if (index >= this.playlist.length) {
          index = 0;
        }
      }
      this.skipTo(index);
    }
  }
  skipTo(index) {
    const sound = this.playlist[this.index].howl;
    if (sound) sound.stop();
    this.play(index);
  }
  volume(event) {
    Howler.volume($(event.target).val() / 100);
  }
  seek(per) {
    const sound = this.playlist[this.index].howl;
    if (sound?.playing()) {
      sound.seek(sound.duration() * per);
    }
  }
  step() {
    const sound = this.playlist[this.index].howl;
    const seek = sound.seek() || 0;
    $('#timer').html(this.formatTime(Math.round(seek)));
    $('#bar').css({
      width: `${((seek / sound.duration()) || 0) * (document.body.offsetWidth - 110)}px`,
      visibility: 'visible'
    });
    if (sound.playing()) {
      window.requestAnimationFrame(this.step.bind(this));
    }
  }
  toggleControls() {

  }
  togglePlaylist() {
    const display = $('#playlist').css('display');
    $('#playlist')[display === 'block' ? 'fadeOut' : 'fadeIn']();
    $('.player').each((i, elem) => $(elem)[display === 'block' ? 'fadeIn' : 'fadeOut']());
  }
  toggleVolume() {
    const display = $('.volume-slider').css('display');
    $('.volume-slider')[display === 'block' ? 'fadeOut' : 'fadeIn']();
  }
  formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  copyright(songWriter, band) {
    let copyright = `&copy; ${songWriter || band}`;
    if (band && songWriter && band !== songWriter) copyright = `${copyright} and ${band}`;
    $('#song-info .copyright').html(copyright);

  }
  toggleSongInfo() {
    if (this.currentSong) {
      const display = $('#song-info').css('display') !== 'none' ? 'none' : 'block';
      if (display === 'none') {
          $('#song-info').fadeOut();
          $('.player').each((i, elem) => $(elem).css('display', 'block'));
      } else {
        const song = this.currentSong;
        $('#song-info .lyrics').empty();
        $('#song-info tbody').empty();
        $('#song-info .song').html(song.title);
        $('#song-info .band').html(song.band);
        song.attribution.forEach(attribute => {
          if (attribute[1]) {
            $('#song-info tbody').append(`<tr>
                <td class="field">${attribute[0]}:</td>
                <td>${attribute[1]}</td>
              </tr>`);
          }
        });
        this.copyright(song.attribution[0][1], song.band);
        if (song.lyrics) {
          fetch(song.lyrics).then(response => response.text().then(text => {
            $('#song-info .lyrics').html(text);
          })).catch(error => {
            console.error('Error encountered:', error.message);
          }).finally(() => {
            $('#song-info').fadeIn();
            $('.player').each((i, elem) => $(elem).css('display', 'none'));
          });
        } else {
          $('.player').each((i, elem) => $(elem).css('display', 'none'));
          $('#song-info').fadeIn();
        }
      }
    }
  }
  calculateSeek(event) {
    const start = $('#timer').width();
    const end = $(window).width() - $('#duration').width();
    const length = end - start;
    const x = event.pageX;
    if (x > start && x < end) {
      this.seek((x - start) / length);
    }
  }
  more() {
    ;
  }
  addEventListeners() {
    $('#play-btn').on('click', () => this.play());
    $('#pause-btn').on('click', () => this.pause());
    $('#prev-btn').on('click', () => this.skip('prev'));
    $('#next-btn').on('click', () => this.skip('next'));
    $('#playlist-btn').on('click', () => this.togglePlaylist());
    $('#playlist').on('click', () => this.togglePlaylist());
    $('#info-btn').on('click', () => this.toggleSongInfo());
    $('#song-info .close').on('click', () => this.toggleSongInfo());
    $('#volume').on('change', event => this.volume(event));
    $('#volume-btn').on('click', () => this.toggleVolume());
    $('#intro').one('click', () => $('#intro').fadeOut());
    $('#progress').on('click', event => this.calculateSeek(event));
    $('#shuffle-btn').on('click', () => this.shuffle());
    $('#more-btn').on('click', () => $('#more').fadeIn());
    $('#more .close').on('click', () => $('#more').fadeOut());
  }
}

export default Player;
