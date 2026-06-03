import $ from 'jquery';

class Slide {
  constructor(images) {
    this.images = images;
    this.backgroundIndex = 0;
    this.slidingBackground = null;
    this.direction = null;
    this.docWidth = 0;
    this.interval = 50;
    this.speed = .15;
    this.posX = 0;
    this.resize();
    $(window).on('resize', this.resize.bind(this));
  }
  resize() {
    this.docWidth = $(window).width();
    $('.back').css('width', `${this.docWidth}px`);
    this.setBackground();
  }
  slide() {
    this.slideCount = this.slideCount + 1;
    const delta = this.speed * (2 * this.docWidth / this.interval);
    if (this.direction === 'right') {
      this.posX += delta;
    } else {
      this.posX -= delta;
    }
    this.slidingBackground.css('left', `${this.posX}px`);
    if (this.slideCount <= this.interval / this.speed) {
      setTimeout(this.slide.bind(this), this.interval);
    } else {
      this.setBackground();
    }
  }
  setBackground() {
    this.slidingBackground = $(`#back${this.backgroundIndex}`);
    const idx = Math.floor(Math.random() * this.images.length);
    this.slidingBackground.css('background-image', `url(${this.images[idx]})`);
    this.slidingBackground.css('z-index', '0');
    this.slidingBackground.css('width', `${this.docWidth}px'`);
    if (this.backgroundIndex === 0) {
      this.backgroundIndex = 1;
      this.posX = -this.docWidth;
      this.slidingBackground.css('left', `${this.posX}px`);
      this.direction = 'right';
    } else {
      this.backgroundIndex = 0;
      this.posX = this.docWidth;
      this.slidingBackground.css('left', `${this.posX}px`);
      this.direction = 'left';
    }
    $(`#back${this.backgroundIndex}`).css('z-index', '-1');
    this.slideCount = 0;
    this.slide();
  }
}

export default Slide;





