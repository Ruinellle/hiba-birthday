let finaleBoost = 0; // ramps up when finale starts

window.startFinale = () => { finaleBoost = 1; };

new p5((p) => {
  let stars = [];
  let conf = [];
  let hearts = [];

  p.setup = () => {
    const holder = document.getElementById("p5-holder");
    p.createCanvas(p.windowWidth, p.windowHeight).parent(holder);
    for (let i = 0; i < 220; i++) stars.push(mkStar());
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    // background: dark dreamy gradient
    p.noStroke();
    for (let y = 0; y < p.height; y++) {
      const t = y / p.height;
      const wave = 0.08 * p.sin(p.frameCount * 0.02 + y * 0.02);
      const tt = p.constrain(t + wave, 0, 1);
      const c1 = p.color(255, 140, 195);
      const c2 = p.color(120, 70, 255);
      p.stroke(p.lerpColor(c1, c2, tt));
      p.line(0, y, p.width, y);
    }
    p.noStroke();

    // stars
    for (let s of stars) {
      s.tw += s.sp;
      s.y -= s.dr * (0.25 + 0.6 * finaleBoost);
      if (s.y < -10) { s.y = p.height + 10; s.x = p.random(p.width); }
      const a = 80 + 160 * (0.5 + 0.5 * p.sin(s.tw));
      p.fill(255, 255, 255, a * 0.7);
      p.circle(s.x, s.y, s.r);
    }

    // ramp boost smoothly
    finaleBoost *= 0.995;
    finaleBoost = Math.max(finaleBoost, 0);

    // emit confetti/hearts when in finale (screen visible)
    const onFinale = document.getElementById("screen-finale").classList.contains("active");
    if (onFinale && p.frameCount % 2 === 0) {
      if (p.random() < 0.7) conf.push(mkConf());
      if (p.random() < 0.65) hearts.push(mkHeart());
    }

    // confetti
    for (let k = conf.length - 1; k >= 0; k--) {
      const c = conf[k];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.03;
      c.a -= 3.2;
      c.r += c.spin;
      p.push();
      p.translate(c.x, c.y);
      p.rotate(c.r);
      p.fill(c.col[0], c.col[1], c.col[2], c.a);
      p.rect(0, 0, c.w, c.h, 3);
      p.pop();
      if (c.a <= 0 || c.y > p.height + 80) conf.splice(k, 1);
    }

    // hearts
    for (let k = hearts.length - 1; k >= 0; k--) {
      const h = hearts[k];
      h.x += h.vx + 0.8 * p.sin(p.frameCount * h.w + h.ph);
      h.y += h.vy;
      h.vy += 0.02;
      h.a -= 2.6;

      p.push();
      p.translate(h.x, h.y);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(h.s);
      // glow
      p.fill(255, 210, 235, h.a * 0.18);
      p.text("♥", p.random(-1, 1), p.random(-1, 1));
      p.fill(255, 90, 155, h.a);
      p.text("♥", 0, 0);
      p.pop();

      if (h.a <= 0 || h.y > p.height + 80) hearts.splice(k, 1);
    }

    // keep arrays reasonable
    if (conf.length > 600) conf.splice(0, conf.length - 600);
    if (hearts.length > 450) hearts.splice(0, hearts.length - 450);
  };

  function mkStar() {
    return { x: p.random(p.width), y: p.random(p.height), r: p.random(1.2, 3.2), tw: p.random(p.TWO_PI), sp: p.random(0.02, 0.06), dr: p.random(0.3, 1.0) };
  }
  function mkConf() {
    const cols = [
      [255, 255, 255], [255, 230, 120], [180, 255, 255],
      [255, 140, 210], [200, 160, 255]
    ];
    const col = cols[Math.floor(p.random(cols.length))];
    return {
      x: p.random(p.width),
      y: -30,
      vx: p.random(-1.2, 1.2),
      vy: p.random(1.2, 3.2),
      w: p.random(8, 16),
      h: p.random(10, 18),
      r: p.random(-0.6, 0.6),
      spin: p.random(-0.06, 0.06),
      a: 255,
      col
    };
  }
  function mkHeart() {
    return {
      x: p.random(p.width),
      y: -20,
      vx: p.random(-1.1, 1.1),
      vy: p.random(0.8, 2.4),
      a: 255,
      s: p.random(16, 30),
      w: p.random(0.03, 0.08),
      ph: p.random(p.TWO_PI)
    };
  }
});
