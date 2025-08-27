document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("titulo");
  const original = titulo.textContent;
  titulo.textContent = "";

  let i = 0;
  let borrando = false;

  const velocidadEscribir = 100; // ms por letra al escribir
  const velocidadBorrar = 50;    // ms por letra al borrar
  const pausaFinal = 1500;       // ms antes de empezar a borrar
  const pausaInicio = 500;       // ms antes de empezar a escribir de nuevo

  function escribir() {
    if (!borrando && i < original.length) {
      titulo.textContent = original.slice(0, i + 1);
      i++;
      setTimeout(escribir, velocidadEscribir);
    } else if (!borrando && i === original.length) {
      borrando = true;
      setTimeout(escribir, pausaFinal);
    } else if (borrando && i > 0) {
      titulo.textContent = original.slice(0, i - 1);
      i--;
      setTimeout(escribir, velocidadBorrar);
    } else {
      borrando = false;
      setTimeout(escribir, pausaInicio);
    }
  }

  escribir();
});
