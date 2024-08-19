let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchMoveX = 0;
    this.touchMoveY = 0;
    this.prevTouchX = 0;
    this.prevTouchY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.rotationStart = 0;
    this.rotationAngle = 0;
  }

  init(paper) {
    this.paper = paper;

    paper.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    paper.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
    paper.addEventListener('touchend', () => this.handleTouchEnd(), { passive: true });

    // For handling rotation gestures on touch screens
    paper.addEventListener('gesturestart', (e) => this.handleGestureStart(e));
    paper.addEventListener('gesturechange', (e) => this.handleGestureChange(e));
    paper.addEventListener('gestureend', () => this.handleGestureEnd());
  }

  handleTouchStart(e) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paper.style.zIndex = highestZ++;
    this.touchStartX = this.prevTouchX = e.touches[0].clientX;
    this.touchStartY = this.prevTouchY = e.touches[0].clientY;
  }

  handleTouchMove(e) {
    e.preventDefault(); // Prevent scrolling while interacting with the paper

    if (!this.holdingPaper || this.rotating) return;

    this.touchMoveX = e.touches[0].clientX;
    this.touchMoveY = e.touches[0].clientY;

    this.velX = this.touchMoveX - this.prevTouchX;
    this.velY = this.touchMoveY - this.prevTouchY;

    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;

    this.prevTouchX = this.touchMoveX;
    this.prevTouchY = this.touchMoveY;

    this.updateTransform();
  }

  handleTouchEnd() {
    this.holdingPaper = false;
    this.rotating = false;
  }

  handleGestureStart(e) {
    e.preventDefault();
    this.rotating = true;
    this.rotationStart = e.rotation;
  }

  handleGestureChange(e) {
    this.rotationAngle = e.rotation - this.rotationStart;
    this.updateTransform();
  }

  handleGestureEnd() {
    this.rotating = false;
  }

  updateTransform() {
    this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation + this.rotationAngle}deg)`;
  }
}

const papers = document.querySelectorAll('.paper');

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
