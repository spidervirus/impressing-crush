let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentX = 0;
    this.currentY = 0;
    this.rotating = false;

    // Bind event handlers
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.updateTransform = this.updateTransform.bind(this);
  }

  init(paper) {
    this.paper = paper;

    // Add event listeners for both touch and mouse events
    paper.addEventListener('mousedown', this.handleStart, { passive: true });
    paper.addEventListener('touchstart', this.handleStart, { passive: true });
  }

  handleStart(e) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paper.style.zIndex = highestZ++;

    const touch = e.touches ? e.touches[0] : e;

    this.startX = this.prevX = touch.clientX;
    this.startY = this.prevY = touch.clientY;

    // Add move and end listeners dynamically based on input type
    if (e.type === 'mousedown') {
      window.addEventListener('mousemove', this.handleMove, { passive: false });
      window.addEventListener('mouseup', this.handleEnd, { passive: true });
    } else {
      window.addEventListener('touchmove', this.handleMove, { passive: false });
      window.addEventListener('touchend', this.handleEnd, { passive: true });
    }
  }

  handleMove(e) {
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    this.velX = touch.clientX - this.prevX;
    this.velY = touch.clientY - this.prevY;

    if (!this.rotating) {
      this.currentX += this.velX;
      this.currentY += this.velY;
    } else {
      const dirX = touch.clientX - this.startX;
      const dirY = touch.clientY - this.startY;
      const angle = Math.atan2(dirY, dirX);
      this.rotation = (angle * 180 / Math.PI + 360) % 360;
    }

    // Request an animation frame to update the transform
    requestAnimationFrame(this.updateTransform);

    this.prevX = touch.clientX;
    this.prevY = touch.clientY;
  }

  updateTransform() {
    this.paper.style.transform = `translateX(${this.currentX}px) translateY(${this.currentY}px) rotateZ(${this.rotation}deg)`;
  }

  handleEnd() {
    this.holdingPaper = false;
    this.rotating = false;

    // Remove move and end listeners based on input type
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleEnd);
    window.removeEventListener('touchmove', this.handleMove);
    window.removeEventListener('touchend', this.handleEnd);
  }
}

const papers = document.querySelectorAll('.paper');

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
