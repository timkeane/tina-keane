import $ from 'jquery';
import {Howl, Howler} from 'howler';

class Player {
  constructor(playlist) {
    this.playlist = playlist;
    this.index = 0;

    let band = '';
    playlist.forEach(song => {
      if (band !== song.band) {
        const bandDiv = $(`<div class="list-band">${song.band}</div>`);
        if (band !== '') $(bandDiv).addClass('band-margin');
        $('#list').append(bandDiv);
        band = song.band;
      }
      const songDiv = $(`<div class="list-song">${song.title}</div>`)
        .on('click', () => {
          this.skipTo(playlist.indexOf(song));
        });
      $('#list').append(songDiv);
    });
    this.addEventListeners();
  }
  play(index) {
    let sound;
    index = typeof index === 'number' ? index : this.index;
    const data = this.playlist[index];
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: [`./${data.file}`],
        html5: true,
        onplay: () => {
          $('#duration').html(this.formatTime(Math.round(sound.duration())));
          window.requestAnimationFrame(this.step.bind(this));
          $('#pauseBtn').show();
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
      $('#playBtn').hide();
      $('#pauseBtn').show();
    } else {
      $('#loading').show();
      $('#playBtn').hide();
      $('#pauseBtn').hide();
    }
    this.index = index;
  }
  pause() {
    const sound = this.playlist[this.index].howl;
    sound.pause();
    $('#playBtn').show();
    $('#pauseBtn').hide();
  }
  skip(direction) {
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
  skipTo(index) {
    if (this.playlist[this.index].howl) {
      this.playlist[this.index].howl.stop();
    }
    this.play(index);
  }
  volume(val) {
    Howler.volume(val);
    const barWidth = (val * 90) / 100;
    $('#barFull').css('width', `${val * 90}%`);
    $('sliderBtn').css('left', `${window.innerWidth * barWidth + window.innerWidth * 0.05 - 25}px`);
  }
  seek(per) {
    // TODO need to hook up to a click event?
    const sound = this.playlist[this.index].howl;
    if (sound.playing()) {
      sound.seek(sound.duration() * per);
    }
  }
  step() {
    const sound = this.playlist[this.index].howl;
    const seek = sound.seek() || 0; // TODO ???? seek doesnt seem to return anything that i can see
    $('#timer').html(this.formatTime(Math.round(seek)));
    $('#bar').css({
      width: `${((seek / sound.duration()) || 0) * (document.body.offsetWidth - 110)}px`,
      visibility: 'visible'
    });
    if (sound.playing()) {
      window.requestAnimationFrame(this.step.bind(this));
    }
  }
  togglePlaylist() {
    const display = $('#playlist').css('display') !== 'none' ? 'none' : 'block';
    const oposite = display === 'block' ? 'none' : 'block';
    setTimeout(function() {
      $('#playlist').css({display});
      $('.player').each((i, elem) => $(elem).css('display', oposite));
    }, (display === 'block') ? 0 : 500);
    $('#playlist')[display === 'block' ? 'fadeIn' : 'fadeOut']();
  }
  toggleVolume() {
    const display = $('#volume').css('display') === 'block' ? 'none' : 'block';
    setTimeout(function() {
      $('#volume').css('display', display);
    }, (display === 'block') ? 0 : 500);
    $('#volume')[display === 'block' ? 'fadeIn' : 'fadeOut']();
  }
  formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  adjustVolume(event) {
    if (this.sliderDown) {
      const x = event.clientX || event.touches[0].clientX;
      const startX = window.innerWidth * 0.05;
      const layerX = x - startX;
      const per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
      this.volume(per);
    }
  }
  addEventListeners() {
    $('#playBtn').on('click', () => this.play());
    $('#pauseBtn').on('click', () => this.pause());
    $('#prevBtn').on('click', () => this.skip('prev'));
    $('#nextBtn').on('click', () => this.skip('next'));
    $('#playlistBtn').on('click', () => this.togglePlaylist());
    $('#playlist').on('click', () => this.togglePlaylist());
    $('#volumeBtn').on('click', () => this.toggleVolume());
    $('#barEmpty').on('click', event => {
      this.volume(event.layerX / parseFloat($('#barEmpty').get(0).scrollWidth));
    });
    $('#sliderBtn').on('mousedown', () => this.sliderDown = true)
      .on('touchstart', () => this.sliderDown = true);
    $('#volume').on('click', () => this.toggleVolume())
      .on('mouseup', () => this.sliderDown = false)
      .on('touchend', () => this.sliderDown = false)
      .on('mousemove', () => this.adjustVolume = false)
      .on('touchmove', () => this.adjustVolume = false);
  }
}

export default Player;