import $ from 'jquery';

class Slide {
  constructor(images) {
    this.images = images;
    this.backgroundIndex = 0;
    this.slidingImg = null;
    this.direction = null;
    this.interval = 50;
    this.speed = 75;
    this.posX = 0;
    $('img.back').on('load', this.fillWindow.bind(this));
    this.setBackground();
  }
  fillWindow (event) {
    const img = $(event.target);
    this.imgScale = $(window).height() / img.height();
    img.css('transform', `scale(${this.imgScale})`);
  }
  slide() {
    const w = $(window).width();
    const delta = (this.speed / w) * (2 * w / this.interval);
    // console.warn((this.speed / w));
    this.slideCount = this.slideCount + 1;
    this.posX -= delta;
    this.slidingImg.css(this.direction, `${this.posX}px`);

    if (
      this.direction === 'right' &&
      this.posX < -this.slidingImg.width() * this.imgScale
    ) {
      this.setBackground();
    } else if (
      this.direction === 'left' &&
      this.posX < -this.slidingImg.width() * this.imgScale
    ) {
      this.setBackground();
    } else {
      setTimeout(this.slide.bind(this), this.interval);
    }
  }
  setBackground() {
    this.slidingImg = $(`#back${this.backgroundIndex}`)
      .one('load', () => {
        setTimeout(() => this.slide(), 500);
      });
    const idx = Math.floor(Math.random() * this.images.length);
    this.slidingImg.css({
        display: 'none',
        left: 'unset',
        top: '0',
        right: 'unset',
        bottom: '0',
        transform: 'unset',
        transformOrigin: 'unset'
      });
    this.slidingImg.attr('src', this.images[idx]);
    this.posX = $(window).width();

    let css = 'left';
    let origin = 'right top'

    if (this.backgroundIndex === 0) {
      this.backgroundIndex = 1;
      this.slidingImg = $('#back0');
      this.direction = 'right';
    } else {
      this.backgroundIndex = 0;
      this.slidingImg = $('#back1');
      this.direction = 'left';
      origin = 'left top';
    }
    this.slidingImg.css(this.direction, `${this.posX}px`)
      .css('transform-origin', origin).show();
    this.slideCount = 0;
  }
}

export default Slide;





