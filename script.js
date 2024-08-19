let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.mouseMoveHandler = this.handleMouseMove.bind(this);
    this.mouseUpHandler = this.handleMouseUp.bind(this);
  }

  init(paper) {
    this.paper = paper;

    paper.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', this.mouseUpHandler);
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (this.rotating) {
      this.updateRotation(e);
    }

    if (this.holdingPaper && !this.rotating) {
      this.updatePosition();
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }

  handleMouseDown(e) {
    if (this.holdingPaper) return;

    this.holdingPaper = true;
    this.paper.style.zIndex = highestZ++;
    this.mouseTouchX = this.mouseX = e.clientX;
    this.mouseTouchY = this.mouseY = e.clientY;
    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    if (e.button === 2) {
      this.rotating = true;
    }

    window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  handleMouseUp() {
    this.holdingPaper = false;
    this.rotating = false;

    window.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  updatePosition() {
    this.velX = this.mouseX - this.prevMouseX;
    this.velY = this.mouseY - this.prevMouseY;

    this.currentPaperX += this.velX;
    this.currentPaperY += this.velY;
  }

  updateRotation(e) {
    const dirX = e.clientX - this.mouseTouchX;
    const dirY = e.clientY - this.mouseTouchY;
    const angle = Math.atan2(dirY, dirX);
    this.rotation = (360 + Math.round((angle * 180) / Math.PI)) % 360;
  }
}

const papers = document.querySelectorAll('.paper');

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
