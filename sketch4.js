const sketch4 = (p) => {
  let particles = [];
  let fireflies = [];
  let bubbles = [];
  const maxBubbles = 30;
  let nextBubbleTime = 0;
  let canvas;
  
  let jellyfishes = [];
  let bigjellyfishes = [];
  let wishes = [];
  
  // Title animation variables
  let titleStartTime = 0;

  // Wish phrases
  const wishPhrases = [
    "Happy 20/10 💕",
    "Chúc mừng ngày 20/10 ✨",
    "Yêu thương ❤️",
    "Mạnh mẽ và xinh đẹp 🌸",
    "Luôn hạnh phúc 😊",
    "Sức khỏe và thành công 🌟",
    "Nụ cười tỏa sáng ✨",
    "Tự tin và tươi sáng 🌈"
  ];

  p.setup = () => {
    const parent = document.getElementById('section4');
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas = p.createCanvas(w, h);
    canvas.parent('section4');

    p.frameRate(60);
    
    titleStartTime = p.millis();

    for (let i = 0; i < 120; i++) {
      particles.push(new Particle());
    }

    for (let i = 0; i < 60; i++) {
      fireflies.push(new Firefly(p.random(2, 1)));
    }

    for (let i = 0; i < 20; i++) {
      jellyfishes.push(new Jellyfish(p.random(w), p.random(h)));
    }

    for (let i = 0; i < 5; i++) {
      bigjellyfishes.push(new BigJellyFish(p.random(w), p.random(h)));
    }

    nextBubbleTime = p.millis() + p.random(300, 3000);
  };

  p.draw = () => {
    setGradientBackground();

    drawCursorGlow();

    for (let ptl of particles) {
      ptl.update();
      ptl.show();
    }

    for (let ff of fireflies) {
      ff.update();
      ff.show();
    }

    for (let j of jellyfishes) {
      j.move();
      j.display();
    }

    for (let b of bigjellyfishes) {
      b.move();
      b.display();
    }

    // Update and display wishes
    for (let i = wishes.length - 1; i >= 0; i--) {
      wishes[i].update();
      wishes[i].display();
      
      if (wishes[i].alpha <= 0) {
        wishes.splice(i, 1);
      }
    }

    handleBubbles();

    const maxWidth = 600;

    const title = "CLB UETLC xin chúc\ncác bạn nữ CEO có một ngày 20/10 tuyệt vời";
    const description = ``;

    const titleSize = 50;
    const centerY = p.height / 2;
    const titlePopDuration = 3000; // Pop up animation duration
    const titleFadeDuration = 1500; // Fade out animation duration
    
    // Calculate animation progress (0 to 1)
    let elapsedTime = p.millis() - titleStartTime;
    let popProgress = p.constrain(elapsedTime / titlePopDuration, 0, 1);
    let fadeProgress = p.constrain((elapsedTime - titlePopDuration) / titleFadeDuration, 0, 1);
    
    // Easing function for pop-up effect (ease-out)
    let easeProgress = 1 - p.pow(1 - popProgress, 2);
    
    // Calculate Y position: stays at center
    let titleY = centerY;
    
    // Calculate scale for pop effect (starts small, grows to normal)
    let scale = p.lerp(0.5, 1, easeProgress);
    
    // Calculate alpha for fade out (1 at start, 0 at end)
    let titleAlpha = p.lerp(255, 0, fadeProgress);
    
    p.textFont('Dancing Script');
    p.fill(255, titleAlpha);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(titleSize * scale);
    p.textLeading(1 * titleSize * scale);
    
    p.push();
    p.translate(p.width / 2, titleY);
    p.text(title, 0, 0);
    p.pop();

    const descSize = 20;
    p.textSize(descSize);
    p.textLeading(1.4 * descSize);

    const descMaxWidth = maxWidth;

    const approxLines = 7;
    const lineHeight = 1.4 * descSize;
    const descHeight = approxLines * lineHeight;

    const descX = p.width - 200 - descMaxWidth;
    const descY = p.height - 200 - descHeight;

    p.textAlign(p.LEFT, p.TOP);
    p.text(description, descX, descY, descMaxWidth);
  };

  p.windowResized = () => {
    const parent = document.getElementById('section4');
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    p.resizeCanvas(w, h);
  };

  // Handle click on big jellyfish
  p.mousePressed = () => {
    for (let b of bigjellyfishes) {
      // Check if click is within jellyfish radius
      const distance = p.dist(p.mouseX, p.mouseY, b.x, b.y);
      if (distance < b.size) {
        // Create wish phrase at jellyfish position
        const randomWish = wishPhrases[p.floor(p.random(wishPhrases.length))];
        wishes.push(new Wish(b.x, b.y, randomWish, b));  // Pass jellyfish reference
        return false; // Prevent default
      }
    }
  };

  function setGradientBackground() {
    let ctx = p.drawingContext;
    let gradient = ctx.createLinearGradient(0, 0, 0, p.height);
    gradient.addColorStop(0, '#0A1E3C');
    gradient.addColorStop(1, '#061224');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, p.width, p.height);
  }

  function drawCursorGlow() {
    const radius = 300;
    const gradient = p.drawingContext.createRadialGradient(
      p.mouseX, p.mouseY, 0,
      p.mouseX, p.mouseY, radius
    );
    gradient.addColorStop(0, 'rgba(6, 30, 67, 1.5)');
    gradient.addColorStop(1, 'rgba(6, 30, 67, 0)');

    p.drawingContext.fillStyle = gradient;
    p.noStroke();
    p.rect(0, 0, p.width, p.height);
  }

  function handleBubbles() {
    const now = p.millis();

    if (now > nextBubbleTime && bubbles.length < maxBubbles) {
      let x = p.mouseX || p.width / 2;
      let y = p.mouseY || p.height / 2;
      bubbles.push(new Bubble(x + p.random(-5, 5), y + p.random(-5, 5)));
      nextBubbleTime = now + p.random(100, 1000);
    }

    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].show();

      if (bubbles[i].pos.y + bubbles[i].size < 0) {
        bubbles.splice(i, 1);
      }
    }
  }

  class Particle {
    constructor() {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.vel = p.createVector(p.random(-0.2, 0.2), p.random(-0.1, 0.1));
      this.size = p.random(1, 3);
      this.alpha = p.random(50, 150);
    }

    update() {
      this.pos.add(this.vel);
      this.pos.x += p.sin(p.frameCount * 0.01 + this.pos.y) * 0.2;
      this.pos.y += p.cos(p.frameCount * 0.01 + this.pos.x) * 0.1;

      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
    }

    show() {
      p.noStroke();
      p.fill(200, 220, 255, this.alpha);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  class Firefly {
    constructor(size) {
      this.pos = p.createVector(p.random(p.width), p.random(p.height));
      this.size = size;
      this.baseAlpha = 25;
      this.speed = p5.Vector.random2D().mult(p.random(0.1, 2));
      this.pulsePhase = p.random(p.TWO_PI);
    }

    update() {
      this.pos.add(this.speed);

      if (this.pos.x > p.width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = p.width;
      if (this.pos.y > p.height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = p.height;
    }

    show() {
      const mouse = p.createVector(p.mouseX, p.mouseY);
      const d = p.dist(this.pos.x, this.pos.y, mouse.x, mouse.y);

      const maxDist = 400;
      let brightnessFactor = p.constrain(1 - d / maxDist, 0, 1);
      brightnessFactor = p.pow(brightnessFactor, 2);

      const dynamicAlpha = this.baseAlpha + brightnessFactor * 230;
      const glowAlpha = brightnessFactor * 200;

      p.noStroke();
      p.fill(255, 255, 180, dynamicAlpha);
      p.ellipse(this.pos.x, this.pos.y, this.size);

      p.drawingContext.shadowBlur = 12;
      p.drawingContext.shadowColor = p.color(255, 255, 200, glowAlpha);
      p.ellipse(this.pos.x, this.pos.y, this.size + 8);
      p.drawingContext.shadowBlur = 0;
    }
  }

  class Bubble {
    constructor(x, y) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1, -2));
      this.alpha = 50;
      this.size = p.random(3, 8);
    }

    update() {
      this.pos.add(this.vel);
    }

    show() {
      p.noStroke();
      p.fill(255, 255, 255, this.alpha);
      p.circle(this.pos.x, this.pos.y, this.size);
    }
  }

  class Jellyfish {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = p.random(20, 40);
      this.speed = p.random(0.3, 1);
      this.offset = p.random(p.TWO_PI);
      this.alpha = p.random(40, 40);
    }

    move() {
      this.y -= this.speed;
      if (this.y + this.size < 0) {
        this.y = p.height + this.size;
        this.x = p.random(p.width);
      }
    }

    display() {
      p.noStroke();
      
      // Glow layers (half circle)
      for (let i = 10; i > 0; i--) {
        p.fill(255, 180, 220, (this.alpha / i) * 0.2);
        p.arc(this.x, this.y, this.size + i * 8, this.size + i * 8, p.PI, p.TWO_PI);
      }
      
      // Main bell head (half circle)
      p.fill(255, 200, 230, this.alpha);
      p.arc(this.x, this.y, this.size, this.size, p.PI, p.TWO_PI);

      // Wavy divide line at the bottom (diameter)
      p.stroke(255, 200, 230, 0);
      p.strokeWeight(10);
      p.noFill();
      p.beginShape();
      
      const waveSegments = 20;
      const radius = this.size / 2 - 10;
      
      for (let i = 0; i <= waveSegments; i++) {
        const progress = i / waveSegments;
        const x = this.x - radius + progress * (radius * 2);
        const waveAmount = p.sin(p.frameCount * 0.1 + i * 0.3 + this.offset) * 4;
        const y = this.y + waveAmount;
        p.vertex(x, y);
      }
      p.endShape();

      // Animated tentacles
      p.stroke(255, 200, 230, this.alpha * 0.6);
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < 5; i++) {
        let xOff = p.sin(p.frameCount * 0.1 + i + this.offset) * 4;
        p.vertex(this.x + xOff + i * 5 - 10 + 10, this.y - 15 + this.size / 2 + i * 10);
      }
      p.endShape();
    }
  }

class BigJellyFish extends Jellyfish {
  constructor(x, y) {
    super(x, y);
    
    this.size = p.random(120, 200);
    this.speed = p.random(0.5, 2.5);
    this.alpha = p.random(200,200)
  }
  
    display() {
      p.noStroke();
      
      // Glow layers (half circle)
      for (let i = 10; i > 0; i--) {
        p.fill(255, 180, 220, (this.alpha / i) * 0.2);
        p.arc(this.x, this.y, this.size + i * 4, this.size + i * 4, p.PI, p.TWO_PI);
      }
      
      // Main bell head (half circle)
      p.fill(255, 200, 230, this.alpha);
      p.arc(this.x, this.y, this.size, this.size, p.PI, p.TWO_PI);

      // Wavy divide line at the bottom (diameter)
      p.stroke(255, 200, 230, this.alpha);
      p.strokeWeight(20);
      p.noFill();
      p.beginShape();
      
      const waveSegments = 20;
      const radius = this.size / 2 - 10;
      
      for (let i = 0; i <= waveSegments; i++) {
        const progress = i / waveSegments;
        const x = this.x - radius + progress * (radius * 2);
        const waveAmount = p.sin(p.frameCount * 0.1 + i * 0.3 + this.offset) * 4;
        const y = this.y + waveAmount;
        p.vertex(x, y);
      }
      p.endShape();

      // Animated tentacles - first set (left side)
      p.stroke(255, 200, 230, this.alpha * 0.6);
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < 8; i++) {
        let xOff = p.sin(p.frameCount * 0.1 + i + this.offset) * 5;
        p.vertex(this.x + xOff + i * 5 - 10, this.y - 80 + this.size / 2 + i * 15);
      }
      p.endShape();

      // Animated tentacles - second set (right side)
      p.stroke(255, 200, 230, this.alpha * 0.6);
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < 8; i++) {
        let xOff = p.sin(p.frameCount * 0.1 + i + this.offset) * 5;
        p.vertex(this.x + xOff + i * 5 + 10, this.y - 80 + this.size / 2 + i * 15);
      }
      p.endShape();

      // Animated tentacles - third set (far left)
      p.stroke(255, 200, 230, this.alpha * 0.6);
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < 8; i++) {
        let xOff = p.sin(p.frameCount * 0.1 + i + this.offset) * 5;
        p.vertex(this.x + xOff - i * 5 - 20, this.y - 80 + this.size / 2 + i * 15);
      }
      p.endShape();

      // Animated tentacles - fourth set (far right)
      p.stroke(255, 200, 230, this.alpha * 0.6);
      p.strokeWeight(3);
      p.noFill();
      p.beginShape();
      for (let i = 0; i < 8; i++) {
        let xOff = p.sin(p.frameCount * 0.1 + i + this.offset) * 5;
        p.vertex(this.x + xOff - i * 5 + 20, this.y - 80 + this.size / 2 + i * 15);
      }
      p.endShape();
    }

  move(){
    super.move();
  }
}

  // Wish class for floating text
  class Wish {
    constructor(x, y, text, jellyfish) {
      this.jellyfish = jellyfish;  // Reference to parent jellyfish
      this.offsetX = 0;            // Offset from jellyfish
      this.offsetY = 0;          // Start above jellyfish
      this.text = text;
      this.alpha = 255;
      this.velocityY = -0.6;       // Slow upward float relative to jellyfish
      this.size = p.random(24, 48);
      this.lifespan = 400;         // Total frames to live
      this.age = 0;
    }

    update() {
      this.age++;
      
      // Float upward relative to the jellyfish
      this.offsetY += this.velocityY;
      
      // Fade out
      this.alpha = p.map(this.age, 0, this.lifespan, 255, 0);
    }

    display() {
      // Position relative to jellyfish
      const x = this.jellyfish.x + this.offsetX;
      const y = this.jellyfish.y + this.offsetY;
      
      p.push();
      p.fill(248, 248, 255, this.alpha);
      p.textSize(this.size);
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('Quicksand');
      p.text(this.text, x, y);
      p.pop();
    }
  }

};


new p5(sketch4, 'section4');
