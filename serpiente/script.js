document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------
  // Máquina de escribir en el título de la pestaña
  const textoTitulo = "tigreguapo";
  let i = 0;
  let escribiendo = true;

  function animarTitulo() {
    if (escribiendo) {
      // Escribir
      document.title = textoTitulo.substring(0, i);
      i++;
      if (i > textoTitulo.length) {
        escribiendo = false;
        setTimeout(animarTitulo, 1000); // pausa antes de borrar
        return;
      }
      setTimeout(animarTitulo, 200); // velocidad de escritura
    } else {
      // Borrar
      document.title = textoTitulo.substring(0, i);
      i--;
      if (i < 0) {
        escribiendo = true;
        setTimeout(animarTitulo, 500); // pausa antes de volver a escribir
        return;
      }
      setTimeout(animarTitulo, 100); // velocidad de borrado
    }
  }
  animarTitulo();

  // -------------------------------
  // Control de contraseña
  const btnEntrar = document.getElementById("btnEntrar");
  const passwordInput = document.getElementById("password");
  let intentos = 0;
  const maxIntentos = 3;
  const contraseñaCorrecta = "Contraseña"; // Cambia por tu contraseña
  const urlSecreta = "/secreto/";
  const urlError = "/error";

  btnEntrar.addEventListener("click", () => {
    const password = passwordInput.value.trim();

    if (password === contraseñaCorrecta) {
      window.location.href = urlSecreta;
    } else {
      intentos++;
      const restante = maxIntentos - intentos;

      mostrarError(`Contraseña incorrecta. Te quedan ${restante} intento(s).`);
      shakeInput(passwordInput);
      passwordInput.value = "";

      if (restante <= 0) {
        setTimeout(() => {
          window.location.href = urlError;
        }, 500);
      }
    }
  });

  function mostrarError(mensaje) {
    let errorBox = document.getElementById("error-box");

    if (!errorBox) {
      errorBox = document.createElement("div");
      errorBox.id = "error-box";
      document.querySelector(".password-box").appendChild(errorBox);
    }

    errorBox.textContent = mensaje;
    errorBox.classList.add("show");

    clearTimeout(errorBox.timeoutId);
    errorBox.timeoutId = setTimeout(() => {
      errorBox.classList.remove("show");
    }, 3000);
  }

  function shakeInput(element) {
    element.classList.add("shake");
    setTimeout(() => {
      element.classList.remove("shake");
    }, 500);
  }

  // -------------------------------
  // Animación de partículas / estrellas parpadeantes
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

      // Movimiento hacia arriba
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

