document.addEventListener("DOMContentLoaded", () => {

  const textoTitulo = "tigreguapo";
  let i = 0;
  let escribiendo = true;

  function animarTitulo() {
    if (escribiendo) {
      document.title = textoTitulo.substring(0, i);
      i++;
      if (i > textoTitulo.length) {
        escribiendo = false;
        setTimeout(animarTitulo, 1000); 
        return;
      }
      setTimeout(animarTitulo, 200); 
    } else {
      document.title = textoTitulo.substring(0, i);
      i--;
      if (i < 0) {
        escribiendo = true;
        setTimeout(animarTitulo, 500); 
        return;
      }
      setTimeout(animarTitulo, 100); 
    }
  }
  animarTitulo();

  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  let stars = [];
  const numStars = 120;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initStars() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        radius: random(1, 2.5),
        speed: random(0.05, 0.2),
        alpha: random(0.3, 1),
        delta: random(0.005, 0.02)
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.fill();

      star.y -= star.speed;
      if (star.y < 0) star.y = canvas.height;

      // Parpadeo
      star.alpha += star.delta;
      if (star.alpha >= 1 || star.alpha <= 0.3) star.delta = -star.delta;
    });
    requestAnimationFrame(animateStars);
  }

  window.addEventListener("resize", initStars);

  initStars();
  animateStars();
});

