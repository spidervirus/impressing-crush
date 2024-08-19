let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;

    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleGestureStart = this.handleGestureStart.bind(this);
    this.handleGestureEnd = this.handleGestureEnd.bind(this);
  }

  init(paper) {
    this.paper = paper;

    paper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    paper.addEventListener('gesturestart', this.handleGestureStart, { passive: false });
    paper.addEventListener('gestureend', this.handleGestureEnd, { passive: false });
  }

  handleTouchStart(e) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paper.style.zIndex = highestZ++;
    
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.prevTouchX = this.touchStartX;
    this.prevTouchY = this.touchStartY;

    window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }

  handleTouchMove(e) {
    e.preventDefault();

    const touch = e.touches[0];
    this.velX = touch.clientX - this.prevTouchX;
    this.velY = touch.clientY - this.prevTouchY;

    if (!this.rotating) {
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
    } else {
      const dirX = touch.clientX - this.touchStartX;
      const dirY = touch.clientY - this.touchStartY;
      const angle = Math.atan2(dirY, dirX);
      this.rotation = (angle * 180 / Math.PI + 360) % 360;
    }

    this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;

    this.prevTouchX = touch.clientX;
    this.prevTouchY = touch.clientY;
  }

  handleTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleGestureStart(e) {
    e.preventDefault();
    this.rotating = true;
  }

  handleGestureEnd() {
    this.rotating = false;
  }
}

const papers = document.querySelectorAll('.paper');

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
