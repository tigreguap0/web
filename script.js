document.addEventListener("DOMContentLoaded", () => {
  const titulo = document.getElementById("titulo");
  let original = titulo.textContent;
  let i = 0;

  setInterval(() => {
    if (i < original.length) {
      titulo.textContent = original.slice(0, i + 1);
      i++;
    } else {
      setTimeout(() => { i = 0; titulo.textContent = ""; }, 2000);
    }
  }, 200);
});
