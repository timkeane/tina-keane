import $ from 'jquery';

class Slide {
  constructor(images) {
    this.images = images;
    this.backgroundIndex = 0;
    this.slidingImg = null;
    this.direction = null;
    this.interval = 50;
    this.speed = .15;
    this.posX = 0;
    $('img.back').on('load', this.fillWindow.bind(this));
    this.setBackground();
  }
  fillWindow (event) {
    const img = $(event.target);
    img.css('transform', `scale(${$(window).height() / img.height()})`);
  }
  slide() {
    this.slideCount = this.slideCount + 1;
    const delta = this.speed * (2 * $(window).width() / this.interval);
    if (this.direction === 'right') {
      this.posX += delta;
    } else {
      this.posX -= delta;
    }
    this.slidingImg.css('left', `${this.posX}px`);
    if (this.slideCount <= this.interval / this.speed) {
      setTimeout(this.slide.bind(this), this.interval);
    } else {
      this.setBackground();
    }
  }
  setBackground() {
    this.slidingImg = $(`#back${this.backgroundIndex}`);
    const idx = Math.floor(Math.random() * this.images.length);
    this.slidingImg.attr('src', this.images[idx]);
    this.slidingImg.css({zIndex: '0', transform: 'unset'});
    if (this.backgroundIndex === 0) {
      this.backgroundIndex = 1;
      this.posX = -$(window).width();
      this.slidingImg.css('left', `${this.posX}px`);
      this.direction = 'right';
    } else {
      this.backgroundIndex = 0;
      this.posX = $(window).width();
      this.slidingImg.css('left', `${this.posX}px`);
      this.direction = 'left';
    }
    $(`#back${this.backgroundIndex}`).css('z-index', '-1');
    this.slideCount = 0;
    this.slide();
  }
}

export default Slide;





