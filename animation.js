let p5Instance = null;
let finaleBoost = 0;

window.startFinale = () => {
  finaleBoost = 1;

  if (!p5Instance) {
    p5Instance = new p5((p) => {

      let stars = [];
      let conf = [];
      let hearts = [];

      p.setup = () => {
        const holder = document.getElementById("p5-holder");
        p.createCanvas(p.windowWidth, p.windowHeight).parent(holder);
        for (let i = 0; i < 200; i++) stars.push(mkStar());
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };

      p.draw = () => {

        // gradient background
        for (let y = 0; y < p.height; y++) {
          let t = y / p.height;
          let c1 = p.color(255, 140, 195);
          let c2 = p.color(120, 70, 255);
          p.stroke(p.lerpColor(c1, c2, t));
          p.line(0, y, p.width, y);
        }
        p.noStroke();

        // stars
        for (let s of stars) {
          s.y -= s.speed;
          if (s.y < 0) s.y = p.height;
          p.fill(255);
          p.circle(s.x, s.y, s.size);
        }

        // confetti
        if (p.frameCount % 3 === 0) {
          conf.push({
            x: p.random(p.width),
            y: -10,
            vy: p.random(2, 5),
            col: p.color(p.random(255), p.random(255), p.random(255))
          });
        }

        for (let i = conf.length - 1; i >= 0; i--) {
          let c = conf[i];
          c.y += c.vy;
          p.fill(c.col);
          p.rect(c.x, c.y, 8, 8);
          if (c.y > p.height) conf.splice(i, 1);
        }

        // hearts
        if (p.frameCount % 4 === 0) {
          hearts.push({
            x: p.random(p.width),
            y: -10,
            vy: p.random(1, 3),
            alpha: 255
          });
        }

        for (let i = hearts.length - 1; i >= 0; i--) {
          let h = hearts[i];
          h.y += h.vy;
          h.alpha -= 2;
          p.fill(255, 90, 155, h.alpha);
          p.textSize(20);
          p.text("♥", h.x, h.y);
          if (h.alpha <= 0) hearts.splice(i, 1);
        }
      };

      function mkStar() {
        return {
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(1, 3),
          speed: p.random(0.5, 1.5)
        };
      }

    });
  }
};
