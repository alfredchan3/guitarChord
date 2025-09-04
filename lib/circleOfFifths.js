// Circle of Fifths 五度圈逻辑库
// 基于原始 p5.js 代码改写为纯 JavaScript 类

export class CircleOfFifths {
  constructor() {
    this.outRatio = 0.8;
    this.outText = ["沒有升降", "1 個 #", "2 個 #", "3 個 #", "4 個 #", "7 個 b / 5 個 #", "6 個 b / 6 個 #", "5 個 b / 7 個 #", "4 個 b", "3 個 b", "2 個 b", "1 個 b"];
    this.outTextSize = 15;

    this.majorRatio = 0.74;
    this.majorText = ["C", "G", "D", "A", "E", "Cb/B", "Gb/F#", "Db/C#", "Ab", "Eb", "Bb", "F"];
    this.majorTextSize = 22;

    this.minorRatio = 0.65;
    this.minorText = ["Am", "Em", "Bm", "F#m", "C#m", "Abm/G#m", "Ebm/D#m", "Bbm/A#m", "Fm", "Cm", "Gm", "Dm"];
    this.minorTextSize = 17;

    this.detailText1 = [
      "C 大調 ─ A 小調",
      "G 大調 ─ E 小調",
      "D 大調 ─ B 小調",
      "A 大調 ─ F# 小調",
      "E 大調 ─ C# 小調",
      "Cb 大調 ─ Ab 小調 / B 大調 ─ G# 小調",
      "Gb 大調 ─ Eb 小調 / F# 大調 ─ D# 小調",
      "Db 大調 ─ Bb 小調 / C# 大調 ─ A# 小調",
      "Ab 大調 ─ F 小調",
      "Eb 大調 ─ C 小調",
      "Bb 大調 ─ G 小調",
      "F 大調 ─ D 小調"
    ];
    this.detailTextSize = 22;

    this.coreRatio = 0.57;
    this.coreType = "Detail";

    this.mouseDir = 0;
    this.acc = 0;
    this.vel = 0;
    this.angle = -3.5; // 1 = 1/12 TAU, global angle
    this.locked = true;

    // 存储canvas和context引用
    this.canvas = null;
    this.ctx = null;
    this.p5Instance = null;
    
    // 图片资源
    this.imgStaff = null;
    this.imgSharp = null;
    this.imgFlat = null;
    
    this.modeLabel = ["Major/Minor", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];
  }

  // 初始化 p5.js 实例
  initP5(containerElement) {
    const self = this;
    
    const sketch = (p) => {
      self.p5Instance = p;
      
      p.preload = () => {
        try {
          // 使用正确的basePath路径
          self.imgStaff = p.loadImage("/guitarChord/staff.png");
          self.imgFlat = p.loadImage("/guitarChord/flat.png");
          self.imgSharp = p.loadImage("/guitarChord/sharp.png");
        } catch (error) {
          console.error("Error loading images:", error);
          // 创建默认的空图片对象
          self.imgStaff = p.createGraphics(1, 1);
          self.imgFlat = p.createGraphics(1, 1);
          self.imgSharp = p.createGraphics(1, 1);
        }
      };

      p.setup = () => {
        try {
          self.canvas = p.createCanvas(800, 800);
          p.ellipseMode(p.CENTER);
          p.colorMode(p.HSB, 100);
          
          // 颜色初始化
          self.outC1 = p.color(60, 30, 70);
          self.outC2 = p.color(60, 30, 80);
          self.outCH = p.color(60, 30, 100);
          self.outCT = p.color(60, 0, 95);
          self.outCSP = p.color(60, 20, 95);
          self.majorC1 = p.color(80, 30, 80);
          self.majorC2 = p.color(80, 30, 70);
          self.majorCT = p.color(80, 30, 20);
          self.minorC1 = p.color(80, 30, 75);
          self.minorC2 = p.color(80, 30, 65);
          self.minorCT = p.color(80, 10, 90);

          self.outTextSize = p.width * 0.01875;
          self.majorTextSize = p.width * 0.0275;
          self.minorTextSize = p.width * 0.02125;
          self.detailTextSize = p.width * 0.0275;

          // 创建锁定按钮
          self.lockButton = p.createButton('[已鎖定]');
          self.lockButton.position(19, 19);
          self.lockButton.mousePressed(() => self.toggleLocked());
        } catch (error) {
          console.error("Error in p5 setup:", error);
        }
      };

      p.draw = () => {
        try {
          p.background(95);
          p.translate(p.width / 2, p.height / 2);
          self.mouseAngle();
          self.rotateGlobal();
          self.drawOuter();
          self.drawOuterText();
          self.drawMajor();
          self.drawMajorText();
          self.drawMinor();
          self.drawMinorText();
          self.drawCore();
          self.debugText();
        } catch (error) {
          console.error("Error in p5 draw:", error);
          // 停止绘制循环以防止无限错误
          p.noLoop();
        }
      };
    };

    // 如果传入了容器元素，在其中创建p5实例
    try {
      if (containerElement) {
        return new p5(sketch, containerElement);
      } else {
        return new p5(sketch);
      }
    } catch (error) {
      console.error("Error creating p5 instance:", error);
      return null;
    }
  }

  toggleLocked() {
    if (this.lockButton) {
      if (this.locked) {
        this.lockButton.html("鎖定");
        this.locked = false;
      } else {
        this.lockButton.html("[已鎖定]");
        this.locked = true;
      }
    }
  }

  highlighted() {
    const p = this.p5Instance;
    let x = this.mouseDir - this.angle;
    while (x < 0) {
      x += 12;
    }
    x = ((x * 10000) % 120000) / 10000;
    return p.floor(x);
  }

  drawOuter() {
    const p = this.p5Instance;
    p.stroke(this.outCSP);
    p.strokeWeight(p.width / 600);
    for (let i = 0; i < 12; i++) {
      p.fill((i % 2 == 0) ? this.outC1 : this.outC2);
      if (i == this.highlighted()) {
        p.fill(this.outCH);
      }
      let j = i + this.angle;
      p.arc(0, 0, p.width * this.outRatio, p.height * this.outRatio, p.TAU * (j / 12), p.TAU * ((j + 1) / 12) - 0.000001, p.PIE);
    }
    p.stroke(20);
    p.noFill();
    p.ellipse(0, 0, p.width * this.outRatio);
  }

  drawOuterText() {
    const p = this.p5Instance;
    for (let i = 0; i < 12; i++) {
      let j = i + this.angle + 3.5;
      p.push();
      p.rotate(p.TAU * (j / 12));
      p.textAlign(p.CENTER);
      p.textSize(this.outTextSize);
      p.noStroke();
      p.fill(this.outCT);
      p.text(this.outText[i], 0, -(p.height * this.outRatio / 2 * 0.945));
      p.pop();
    }
  }

  drawMajor() {
    const p = this.p5Instance;
    p.stroke(90);
    for (let i = 0; i < 12; i++) {
      p.fill((i % 2 == 0) ? this.majorC1 : this.majorC2);
      let j = i + this.angle;
      p.arc(0, 0, p.width * this.majorRatio, p.height * this.majorRatio, p.TAU * (j / 12), p.TAU * ((j + 1) / 12) - 0.000001);
    }
  }

  drawMajorText() {
    const p = this.p5Instance;
    for (let i = 0; i < 12; i++) {
      let j = i + this.angle + 3.5;
      p.push();
      p.rotate(p.TAU * (j / 12));
      p.textAlign(p.CENTER);
      p.textSize(this.majorTextSize);
      p.noStroke();
      p.fill(this.majorCT);
      p.text(this.majorText[i], 0, -(p.height * this.majorRatio / 2 * 0.91));
      p.pop();
    }
  }

  drawMinor() {
    const p = this.p5Instance;
    p.noStroke();
    for (let i = 0; i < 12; i++) {
      p.fill((i % 2 == 0) ? this.minorC1 : this.minorC2);
      let j = i + this.angle;
      p.arc(0, 0, p.width * this.minorRatio, p.height * this.minorRatio, p.TAU * (j / 12), p.TAU * ((j + 1) / 12) - 0.000001);
    }
  }

  drawMinorText() {
    const p = this.p5Instance;
    for (let i = 0; i < 12; i++) {
      let j = i + this.angle + 3.5;
      p.push();
      p.rotate(p.TAU * (j / 12));
      p.textAlign(p.CENTER);
      p.textSize(this.minorTextSize);
      p.noStroke();
      p.fill(this.minorCT);
      p.text(this.minorText[i], 0, -(p.height * this.minorRatio / 2 * 0.91));
      p.pop();
    }
  }

  drawCore() {
    switch (this.coreType) {
      case "Empty":
        this.drawCoreEmpty();
        break;
      case "Black":
        this.drawCoreBlack();
        break;
      case "Detail":
        this.drawCoreDetail();
        break;
      default:
        this.drawCoreEmpty();
    }
  }

  drawCoreDetail() {
    const p = this.p5Instance;
    p.fill(100);
    p.stroke(40);
    p.ellipse(0, 0, p.width * this.coreRatio);
    p.fill(20);
    p.noStroke();
    p.textAlign(p.CENTER);
    p.textSize(this.detailTextSize);
    p.text(this.detailText1[this.highlighted()], 0, p.height * 0.08);

    p.imageMode(p.CENTER);
    p.image(this.imgStaff, 0, p.height * -0.03, p.width / 2, p.height * 0.15);
    let sig = this.highlighted();
    sig = (sig > 6) ? sig - 12 : sig;

    switch (sig) {
      case 5:
        p.stroke(0);
        p.strokeWeight(p.width / 400);
        p.line(p.width * -0.008, p.height * -0.066, p.width * -0.008, p.height * 0.009);
        p.strokeWeight(p.width / 800);
        this.drawKeySig(5, 0.02, 1);
        this.drawKeySig(-7, -0.16, 1);
        this.drawSigNumber(5, -7);
        break;
      case 6:
        p.stroke(0);
        p.strokeWeight(p.width / 400);
        p.line(p.width * -0.008, p.height * -0.066, p.width * -0.008, p.height * 0.009);
        p.strokeWeight(p.width / 800);
        this.drawKeySig(6, 0.02, 1);
        this.drawKeySig(-6, -0.16, 1);
        this.drawSigNumber(6, -6);
        break;
      case -5:
        p.stroke(0);
        p.strokeWeight(p.width / 400);
        p.line(p.width * -0.008, p.height * -0.066, p.width * -0.008, p.height * 0.009);
        p.strokeWeight(p.width / 800);
        this.drawKeySig(7, 0.02, 1);
        this.drawKeySig(-5, -0.16, 1);
        this.drawSigNumber(7, -5);
        break;
      default:
        this.drawKeySig(sig, -0.16, 1);
        this.drawSigNumber((sig > 0) ? sig : 0, (sig < 0) ? sig : 0);
    }
  }

  drawSigNumber(s, f) {
    const p = this.p5Instance;
    p.noStroke();
    p.fill(80);
    let acci = [
      "Fb", "Cb", "Gb", "Db", "Ab", "Eb", "Bb", "",
      "F#", "C#", "G#", "D#", "A#", "E#", "B#"
    ];
    let sp = 0.024; // space
    let w = 0.02; // width
    let h = 0.004; // height
    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER);
    for (let i = -7; i < 8; i++) {
      switch (true) {
        case (i < 0): // flat
          p.fill(20, (i < f) ? 20 : 100, (i < f) ? 90 : 70);
          break;
        case (i > 0): // sharp
          p.fill(100, (i > s) ? 20 : 90, (i < s) ? 90 : 80);
          break;
        default:
          p.fill(80);
          p.textSize(p.width / 60);
          p.text("♮", 0, p.height * 0.14);
          p.fill(60);
      }
      p.rect((0 + sp * i) * p.width, p.height * 0.12, p.height * w, p.height * h);
      p.textSize(p.width / 74);
      p.text(acci[i + 7], (0 + sp * i) * p.width, p.height * 0.138);
    }
    p.textSize(p.width / 60);
    p.fill(90);
    p.text(`（${-f} 個降記號 / ${s} 個升記號）`, 0, p.height * 0.16);
  }

  drawKeySig(sig, x, y) {
    const p = this.p5Instance;
    let sx = x;
    let sp = 0.02;
    if (sig > 0) {
      p.imageMode(p.CENTER);
      let sy = [-0.066, -0.039, -0.077, -0.0475, -0.017, -0.0575, -0.02875];
      for (let i = 0; i < sig; i++) {
        p.image(this.imgSharp, p.width * (sx + (i * sp)), p.height * sy[i], p.width / 16, p.height / 16);
      }
    }
    if (sig < 0) {
      p.imageMode(p.CENTER);
      let sy = [-0.0289, -0.059, -0.021, -0.049, -0.012, -0.04, -0.002];
      for (let i = 0; i < p.abs(sig); i++) {
        p.image(this.imgFlat, p.width * (sx + (i * sp)), p.height * sy[i], p.width / 16, p.height / 16);
      }
    }
  }

  drawCoreEmpty() {
    const p = this.p5Instance;
    p.fill(100);
    p.stroke(40);
    p.ellipse(0, 0, p.width * this.coreRatio);
  }

  drawCoreBlack() {
    const p = this.p5Instance;
    p.fill(0);
    p.stroke(40);
    p.ellipse(0, 0, p.width * this.coreRatio);
  }

  debugText() {
    const p = this.p5Instance;
    p.fill(0);
    p.noStroke();
    p.textAlign(p.CENTER);
    p.text("Circle of Fifths by NiceChord (Wiwi Kuan)", 0, p.height * 0.45);
  }

  mouseAngle() {
    const p = this.p5Instance;
    let v = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
    let h = v.heading(); // -PI ~ PI
    let i = p.map(h, -p.PI, p.PI, 6, 18);
    this.mouseDir = (i > 12) ? i - 12 : i;
  }

  rotateGlobal() {
    const p = this.p5Instance;
    this.acc = (p.mouseX - p.width / 2) / p.width;
    if (p.abs(this.acc) > 0.4) {
      this.vel += this.acc / 70;
      this.vel = p.constrain(this.vel, -0.1, 0.1);
    }

    if (this.locked) {
      this.vel = 0; // friction
    } else {
      this.vel *= 0.9;
    }
    this.angle += this.vel;
  }

  // 清理资源
  destroy() {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }
    if (this.lockButton) {
      this.lockButton.remove();
      this.lockButton = null;
    }
  }
}
